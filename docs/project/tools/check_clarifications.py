import os
import re
import sys

PROJECT_DOCS = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DECISIONS = os.path.join(PROJECT_DOCS, 'decisions.md')
CLARIFICATIONS = os.path.join(PROJECT_DOCS, 'clarifications')
PRODUCT_OWNER_TOPIC = re.compile(r'^(Product owner|UC-\d{3}.*)$')


def decision_rows():
    with open(DECISIONS) as decisions:
        for line in decisions:
            if line.startswith('| D-'):
                cells = [cell.strip() for cell in line.strip().strip('|').split('|')]
                yield {'id': cells[0], 'topic': cells[2], 'status': cells[5]}


def product_owner_answers_in_force():
    return [row['id'] for row in decision_rows()
            if PRODUCT_OWNER_TOPIC.match(row['topic']) and not row['status'].startswith('superseded')]


def clarifications_text():
    texts = []
    for name in sorted(os.listdir(CLARIFICATIONS)):
        if name.endswith('.md'):
            with open(os.path.join(CLARIFICATIONS, name)) as clarification:
                texts.append(clarification.read())
    return '\n'.join(texts)


def uncited(decision_ids, text):
    return [decision_id for decision_id in decision_ids if not re.search(rf'\b{decision_id}\b', text)]


def main():
    missing = uncited(product_owner_answers_in_force(), clarifications_text())
    if missing:
        print('Product owner answers in force but cited in no clarification file:', ', '.join(missing))
        print('Move each answer into docs/project/clarifications/ and cite its decision there.')
        sys.exit(1)
    print('Every product owner answer in force is in docs/project/clarifications/.')


if __name__ == '__main__':
    main()
