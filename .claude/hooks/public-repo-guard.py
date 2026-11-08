import json
import os
import re
import shlex
import subprocess
import sys

ROOT = os.path.realpath(os.environ.get('CLAUDE_PROJECT_DIR') or os.getcwd())
FINDINGS = os.path.join(ROOT, '.claude/private/findings.md')
PUBLIC_MANIFEST = os.path.join(ROOT, 'docs/project/tracking/github-project.json')
SELF = '.claude/hooks/public-repo-guard.py'

FINDING_ROW = re.compile(r'^\| ([A-Z]{1,2}\d{1,3})\b', re.MULTILINE)
RISKY_WORDS = re.compile(r'vulnerab\w*|exploit\w*|security findings?', re.IGNORECASE)
NEVER_COMMIT = [
    re.compile(r'^\.claude/private/'),
    re.compile(r'^CLAUDE\.local\.md$'),
    re.compile(r'^backend/\.env'),
    re.compile(r'(^|/)\.env\.keys$'),
    re.compile(r'(^|/)\.env\.[\w.-]*local$'),
    re.compile(r'^\.claude/settings\.local\.json$'),
]
MAX_LISTED = 12


DIFFERENCES_FOUND = 1


def git(*args, accepted=(0,)):
    result = subprocess.run(['git', *args], cwd=ROOT, capture_output=True, text=True)
    return result.stdout if result.returncode in accepted else ''


def private_finding_ids():
    try:
        with open(FINDINGS, encoding='utf-8') as file:
            ids = set(FINDING_ROW.findall(file.read()))
        with open(PUBLIC_MANIFEST, encoding='utf-8') as file:
            items = json.load(file).get('items', [])
    except (OSError, ValueError):
        return set()
    public = {item.get('key') for item in items} | {item.get('ref') for item in items}
    return ids - public


def segments(command):
    for part in re.split(r'&&|\|\||;|\n', command):
        try:
            yield shlex.split(part)
        except ValueError:
            yield part.split()


def is_git(words, subcommand):
    return len(words) >= 2 and words[0] == 'git' and words[1] == subcommand


def paths_added_in(command):
    paths = []
    for words in segments(command):
        if is_git(words, 'add'):
            paths += [word for word in words[2:] if not word.startswith('-')]
    return paths


def added_lines(diff):
    current = None
    for line in diff.splitlines():
        if line.startswith('+++ '):
            current = line[6:] if line.startswith('+++ b/') else None
        elif line.startswith('+') and current:
            yield current, line[1:]


def untracked(paths):
    if not paths:
        return []
    listed = git('ls-files', '--others', '--exclude-standard', '--', *paths)
    return [path for path in listed.splitlines() if path]


def pending_changes(command):
    names = set(git('diff', '--staged', '--name-only', '--diff-filter=ACMR').splitlines())
    diffs = [git('diff', '--staged', '-U0', '--no-color', '--diff-filter=ACMR')]
    to_add = paths_added_in(command)
    if to_add:
        names |= set(git('diff', 'HEAD', '--name-only', '--diff-filter=ACMR', '--', *to_add).splitlines())
        diffs.append(git('diff', 'HEAD', '-U0', '--no-color', '--diff-filter=ACMR', '--', *to_add))
        for path in untracked(to_add):
            names.add(path)
            diffs.append(git('diff', '--no-index', '-U0', '--no-color', '/dev/null', path,
                             accepted=(0, DIFFERENCES_FOUND)))
    return names, [change for diff in diffs for change in added_lines(diff)]


def message_of(command):
    return command if SELF not in command else command.replace(SELF, '')


def matches_in(text, ids):
    found = [match.group(0) for match in RISKY_WORDS.finditer(text)]
    found += [word for word in re.findall(r'\b[A-Z]{1,2}\d{1,3}\b', text) if word in ids]
    return found


def problems(command):
    ids = private_finding_ids()
    names, lines = pending_changes(command)
    names |= {os.path.normpath(path) for path in paths_added_in(command)}
    listed = [f'never-commit file: {name}' for name in sorted(names) if any(rule.search(name) for rule in NEVER_COMMIT)]
    listed += [f'commit message: "{term}"' for term in matches_in(message_of(command), ids)]
    for path, line in lines:
        if path != SELF:
            listed += [f'{path}: "{term}"' for term in matches_in(line, ids)]
    return list(dict.fromkeys(listed))


def main():
    call = json.load(sys.stdin)
    if call.get('tool_name') != 'Bash':
        return
    command = (call.get('tool_input') or {}).get('command', '')
    if not any(is_git(words, 'commit') for words in segments(command)):
        return
    found = problems(command)
    if not found:
        return
    shown = found[:MAX_LISTED]
    more = f' (+{len(found) - MAX_LISTED} more)' if len(found) > MAX_LISTED else ''
    print(json.dumps({'hookSpecificOutput': {
        'hookEventName': 'PreToolUse',
        'permissionDecision': 'ask',
        'permissionDecisionReason': 'Public repo check: ' + '; '.join(shown) + more
        + '. Private finding IDs, security wording and private files must not reach the public repo.'
    }}))


main()
