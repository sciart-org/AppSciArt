import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
BACKEND = os.path.join(ROOT, 'backend')
CASE_ID = re.compile(r'\*\*(B\d+)\*\*')


def brief_cases(brief_path):
    with open(brief_path) as brief:
        return list(dict.fromkeys(CASE_ID.findall(brief.read())))


def coverage_of(brief_path):
    with open(brief_path.removesuffix('.md') + '.coverage.json') as coverage:
        return json.load(coverage)


def test_results(test_file):
    with tempfile.TemporaryDirectory() as scratch:
        report = os.path.join(scratch, 'report.json')
        subprocess.run(['npm', 'test', '--', test_file, '--reporter=json', f'--outputFile={report}'],
                       cwd=BACKEND, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        with open(report) as results:
            return [test for suite in json.load(results)['testResults'] for test in suite['assertionResults']]


def problems(cases, coverage, tests):
    titles = [test['title'] for test in tests]
    duplicated = sorted({title for title in titles if titles.count(title) > 1})
    mapped = [title for title_list in coverage.values() for title in title_list]
    return {
        'brief cases with no test': [case for case in cases if not coverage.get(case)],
        'coverage keys that are not brief cases': [key for key in coverage if key not in cases],
        'mapped tests that do not exist': sorted(set(mapped) - set(titles)),
        'tests mapped to no brief case': sorted(set(titles) - set(mapped)),
        'duplicated test names': duplicated,
    }


def main(brief_path, test_file):
    cases = brief_cases(brief_path)
    coverage = coverage_of(brief_path)
    tests = test_results(test_file)
    status_by_title = {test['title']: test['status'] for test in tests}
    for case in cases:
        statuses = [status_by_title.get(title, 'missing') for title in coverage.get(case, [])]
        print(f'{case}: {len(statuses)} test(s), ' + (', '.join(statuses) or 'none'))
    found = {name: items for name, items in problems(cases, coverage, tests).items() if items}
    for name, items in found.items():
        print(f'\n{name}:')
        for item in items:
            print(f'  - {item}')
    print(f'\n{len(cases)} cases, {len(tests)} tests: ' + ('coverage OK' if not found else 'coverage PROBLEMS'))
    return 1 if found else 0


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('usage: python3 -I check_brief_coverage.py <brief.md> <tests/acceptance/file.test.js>')
    sys.exit(main(sys.argv[1], sys.argv[2]))
