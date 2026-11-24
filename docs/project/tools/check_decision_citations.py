import os
import re
import sys

PROJECT_DOCS = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REPO = os.path.abspath(os.path.join(PROJECT_DOCS, '..', '..'))
DECISIONS = os.path.join(PROJECT_DOCS, 'decisions.md')
FROZEN_DOCS = {DECISIONS, os.path.join(PROJECT_DOCS, 'testing', 'history.md')}
LIVING_FILES = ['CLAUDE.md', os.path.join('backend', 'tests', 'HELPERS.md')]
LIVING_FOLDERS = [
    os.path.join('docs', 'project'),
    os.path.join('.claude', 'rules'),
    os.path.join('.claude', 'skills'),
    os.path.join('.claude', 'agents'),
]
DECISION_ID = re.compile(r'\bD-\d{3}\b')
FULLY_SUPERSEDED = re.compile(r'^superseded by (.+)$')


def decision_rows():
    with open(DECISIONS) as decisions:
        for line in decisions:
            if line.startswith('| D-'):
                cells = [cell.strip() for cell in line.strip().strip('|').split('|')]
                yield cells[0], cells[5]


def replacements_of_fully_superseded():
    replacements = {}
    for decision_id, status in decision_rows():
        superseded = FULLY_SUPERSEDED.match(status)
        if superseded:
            replacements[decision_id] = set(DECISION_ID.findall(superseded.group(1)))
    return replacements


def living_docs():
    paths = [os.path.join(REPO, name) for name in LIVING_FILES]
    for folder in LIVING_FOLDERS:
        for root, _, names in os.walk(os.path.join(REPO, folder)):
            paths += [os.path.join(root, name) for name in names if name.endswith('.md')]
    return sorted(path for path in paths if os.path.isfile(path) and path not in FROZEN_DOCS)


def stale_citations(path, replacements):
    with open(path) as doc:
        for number, line in enumerate(doc, start=1):
            cited = set(DECISION_ID.findall(line))
            for decision_id in sorted(cited & replacements.keys()):
                if not replacements[decision_id] & cited:
                    yield number, decision_id, ', '.join(sorted(replacements[decision_id]))


def main():
    replacements = replacements_of_fully_superseded()
    problems = [f'{os.path.relpath(path, REPO)}:{number} cites {decision_id}, superseded by {replacing}'
                for path in living_docs()
                for number, decision_id, replacing in stale_citations(path, replacements)]
    if problems:
        print('\n'.join(problems))
        print('Cite the replacing row, or add it next to the old one on a history line.')
        sys.exit(1)
    print('No living doc cites a fully superseded decision.')


if __name__ == '__main__':
    main()
