import argparse
import hashlib
import json
import subprocess
import sys
import time
from pathlib import Path

PROJECT_DOCS = Path(__file__).resolve().parents[1]
MANIFEST = PROJECT_DOCS / 'tracking' / 'github-project.json'
PRIVATE_ITEMS = PROJECT_DOCS.parents[1] / '.claude' / 'private' / 'tracking' / 'security-items.json'
SINGLE_SELECT_FIELDS = {'status': 'Status', 'phase': 'Phase', 'kind': 'Kind'}
TEXT_FIELDS = {'ref': 'Ref', 'commits': 'Commits'}
CREATION_PAUSE_SECONDS = 1.5


def gh(*args, input_text=None):
    result = subprocess.run(['gh', *args], capture_output=True, text=True, input=input_text)
    if result.returncode != 0:
        sys.exit(f'gh {" ".join(args[:3])} failed: {result.stderr.strip()}')
    return result.stdout


def graphql(query, **variables):
    args = ['api', 'graphql', '-f', f'query={query}']
    for name, value in variables.items():
        args += ['-F' if isinstance(value, int) else '-f', f'{name}={value}']
    return json.loads(gh(*args))['data']


def load_project(org, number):
    data = graphql('''query($org:String!,$n:Int!){organization(login:$org){projectV2(number:$n){id
      fields(first:50){nodes{... on ProjectV2FieldCommon{id name} ... on ProjectV2SingleSelectField{options{id name}}}}}}}''',
                   org=org, n=number)['organization']['projectV2']
    fields = {f['name']: f for f in data['fields']['nodes'] if f}
    return {'id': data['id'], 'fields': fields}


def fingerprint(item):
    tracked = {k: item[k] for k in ('title', 'body', 'status', 'phase', 'kind', 'ref', 'commits', 'labels',
                                    'milestone', 'parent')}
    return hashlib.sha256(json.dumps(tracked, sort_keys=True).encode()).hexdigest()[:16]


def refuse_public_security_items(items):
    private_keys = {i['key'] for i in items if i['project'] == 'security'}
    leaks = [i['key'] for i in items
             if i['project'] == 'public' and (i['kind'] == 'Security' or i['ref'] in private_keys)]
    if leaks:
        sys.exit(f'Refusing: security items marked public: {", ".join(leaks)}')


def ensure_repo_metadata(repo, items, dry_run):
    labels = {label['name'] for label in json.loads(gh('label', 'list', '-R', repo, '--limit', '200', '--json', 'name'))}
    milestones = {m['title'] for m in json.loads(gh('api', f'repos/{repo}/milestones?state=all'))}
    for label in sorted({label for i in items if i['project'] == 'public' for label in i['labels']} - labels):
        print(f'create label {label}')
        if not dry_run:
            gh('label', 'create', label, '-R', repo, '--color', 'c5def5')
    for milestone in sorted({i['milestone'] for i in items if i['milestone']} - milestones):
        print(f'create milestone {milestone}')
        if not dry_run:
            gh('api', f'repos/{repo}/milestones', '-f', f'title={milestone}')


def set_fields(project, item_id, item):
    for key, name in SINGLE_SELECT_FIELDS.items():
        field = project['fields'][name]
        option = next(o['id'] for o in field['options'] if o['name'] == item[key])
        graphql('''mutation($p:ID!,$i:ID!,$f:ID!,$o:String!){updateProjectV2ItemFieldValue(input:{projectId:$p,itemId:$i,
          fieldId:$f,value:{singleSelectOptionId:$o}}){projectV2Item{id}}}''',
                p=project['id'], i=item_id, f=field['id'], o=option)
    for key, name in TEXT_FIELDS.items():
        field_id = project['fields'][name]['id']
        if item[key]:
            graphql('''mutation($p:ID!,$i:ID!,$f:ID!,$t:String!){updateProjectV2ItemFieldValue(input:{projectId:$p,
              itemId:$i,fieldId:$f,value:{text:$t}}){projectV2Item{id}}}''',
                    p=project['id'], i=item_id, f=field_id, t=item[key])
        else:
            graphql('''mutation($p:ID!,$i:ID!,$f:ID!){clearProjectV2ItemFieldValue(input:{projectId:$p,itemId:$i,
              fieldId:$f}){projectV2Item{id}}}''', p=project['id'], i=item_id, f=field_id)


def issue_ids(repo, number):
    issue = json.loads(gh('api', f'repos/{repo}/issues/{number}'))
    return issue['node_id'], issue['id'], issue['state']


def create_issue(repo, item):
    args = ['issue', 'create', '-R', repo, '--title', item['title'], '--body-file', '-']
    for label in item['labels']:
        args += ['--label', label]
    if item['milestone']:
        args += ['--milestone', item['milestone']]
    url = gh(*args, input_text=item['body']).strip()
    return int(url.rsplit('/', 1)[1])


def update_issue(repo, item):
    args = ['issue', 'edit', str(item['issueNumber']), '-R', repo, '--title', item['title'], '--body-file', '-',
            '--milestone', item['milestone'] or '']
    if not item['milestone']:
        args = args[:-2] + ['--remove-milestone']
    for label in item['labels']:
        args += ['--add-label', label]
    gh(*args, input_text=item['body'])


def link_parent(repo, parent_number, child_database_id):
    existing = json.loads(gh('api', f'repos/{repo}/issues/{parent_number}/sub_issues?per_page=100'))
    if child_database_id not in {child['id'] for child in existing}:
        gh('api', '-X', 'POST', f'repos/{repo}/issues/{parent_number}/sub_issues', '-F',
           f'sub_issue_id={child_database_id}')


def match_issue_state(repo, item, state):
    done = item['status'] == 'Done'
    if done and state == 'open':
        gh('issue', 'close', str(item['issueNumber']), '-R', repo, '--reason', 'completed')
    if not done and state == 'closed':
        gh('issue', 'reopen', str(item['issueNumber']), '-R', repo)


def sync_public(repo, project, item, by_key, save):
    if item['issueNumber'] is None:
        item['issueNumber'] = create_issue(repo, item)
        save()
        time.sleep(CREATION_PAUSE_SECONDS)
    else:
        update_issue(repo, item)
    node_id, database_id, state = issue_ids(repo, item['issueNumber'])
    if item['itemId'] is None:
        item['itemId'] = graphql('''mutation($p:ID!,$c:ID!){addProjectV2ItemById(input:{projectId:$p,contentId:$c})
          {item{id}}}''', p=project['id'], c=node_id)['addProjectV2ItemById']['item']['id']
        save()
    set_fields(project, item['itemId'], item)
    if item['parent']:
        link_parent(repo, by_key[item['parent']]['issueNumber'], database_id)
    match_issue_state(repo, item, state)


def sync_draft(project, item, save):
    if item['itemId'] is None:
        created = graphql('''mutation($p:ID!,$t:String!,$b:String!){addProjectV2DraftIssue(input:{projectId:$p,
          title:$t,body:$b}){projectItem{id content{... on DraftIssue{id}}}}}''',
                          p=project['id'], t=item['title'], b=item['body'])['addProjectV2DraftIssue']['projectItem']
        item['itemId'], item['draftId'] = created['id'], created['content']['id']
        save()
    else:
        graphql('''mutation($d:ID!,$t:String!,$b:String!){updateProjectV2DraftIssue(input:{draftIssueId:$d,title:$t,
          body:$b}){draftIssue{id}}}''', d=item['draftId'], t=item['title'], b=item['body'])
    set_fields(project, item['itemId'], item)


def main():
    parser = argparse.ArgumentParser(description='Sync the roadmap manifest to the GitHub projects.')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()

    manifest = json.loads(MANIFEST.read_text())
    private = json.loads(PRIVATE_ITEMS.read_text()) if PRIVATE_ITEMS.exists() else None
    items = manifest['items'] + (private['items'] if private else [])
    by_key = {i['key']: i for i in items}
    refuse_public_security_items(items)
    pending = [i for i in items if i.get('synced') != fingerprint(i)]
    ensure_repo_metadata(manifest['repo'], items, args.dry_run)
    print(f'{len(pending)} of {len(items)} items to sync')
    if args.dry_run:
        for item in pending:
            action = 'create' if item['itemId'] is None else 'update'
            print(f"  {action} {item['project']:<8} {item['key']:<14} [{item['status']}] {item['title']}")
        return

    def save():
        MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')
        if private:
            PRIVATE_ITEMS.write_text(json.dumps(private, indent=2, ensure_ascii=False) + '\n')

    projects = {name: load_project(manifest['org'], number) for name, number in manifest['projects'].items()}
    for item in pending:
        if item['project'] == 'public':
            sync_public(manifest['repo'], projects['public'], item, by_key, save)
        else:
            sync_draft(projects['security'], item, save)
        item['synced'] = fingerprint(item)
        save()
        print(f"  synced {item['key']}" + (f" #{item['issueNumber']}" if item['issueNumber'] else ''))


if __name__ == '__main__':
    main()
