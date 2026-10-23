import json
import os
import re
import sys

ROOT = os.path.realpath(os.environ.get('CLAUDE_PROJECT_DIR') or os.getcwd())

READABLE = [
    '.claude/analysis/srs-export.txt',
    'docs/project/testing/briefs/',
    'docs/project/clarifications/',
    'backend/api/',
    'backend/tests/HELPERS.md',
    'backend/tests/acceptance/',
]

WRITABLE = [
    re.compile(r'^backend/tests/acceptance/[\w.-]+\.test\.js$'),
    re.compile(r'^docs/project/testing/briefs/[\w.-]+\.coverage\.json$'),
]

OUTPUT_FILTER = r'(?:\s*\|\s*(?:tail|head|grep)(?:\s+[^;&|`$<>()]*)?)*'
ALLOWED_COMMANDS = re.compile(
    r'^(?:cd\s+(?:\S*/)?backend\s*&&\s*)?'
    r'(?:npm\s+test(?:\s+--(?:\s+[^;&|`$<>()]*)?)?'
    r'|npx\s+vitest\s+run(?:\s+[^;&|`$<>()]*)?'
    r'|npx\s+eslint(?:\s+[^;&|`$<>()]*)?)'
    r'(?:\s+2>&1)?' + OUTPUT_FILTER + r'\s*$'
)
HIDDEN_IN_COMMAND = re.compile(r'(?:^|[\s/=])(?:src|frontend|support|infra|analysis|private)(?:[\s/]|$)')


def relative(path, cwd):
    absolute = os.path.realpath(os.path.join(cwd, os.path.expanduser(path)))
    if absolute != ROOT and not absolute.startswith(ROOT + os.sep):
        return None
    return os.path.relpath(absolute, ROOT).replace(os.sep, '/')


def literal_prefix(pattern):
    return re.split(r'[*?\[{]', pattern, maxsplit=1)[0]


def is_readable(rel):
    if rel is None:
        return False
    return any(rel == allowed.rstrip('/') or rel.startswith(allowed) for allowed in READABLE)


def glob_base(tool_input, cwd):
    base = tool_input.get('path') or cwd
    pattern_dir = os.path.dirname(literal_prefix(tool_input.get('pattern', '')))
    return relative(os.path.join(base, pattern_dir), cwd)


def refusal(tool_name, tool_input, cwd):
    if tool_name == 'Read':
        rel = relative(tool_input.get('file_path', ''), cwd)
        return None if is_readable(rel) else f'{rel or tool_input.get("file_path")} is outside the black-box sources'
    if tool_name == 'Grep':
        rel = relative(tool_input.get('path') or cwd, cwd)
        return None if is_readable(rel) else f'searching {rel or "outside the project"} is outside the black-box sources'
    if tool_name == 'Glob':
        rel = glob_base(tool_input, cwd)
        return None if is_readable(rel) else f'listing {rel or "outside the project"} is outside the black-box sources'
    if tool_name in ('Write', 'Edit'):
        rel = relative(tool_input.get('file_path', ''), cwd)
        writable = rel is not None and any(rule.match(rel) for rule in WRITABLE)
        return None if writable else f'writing {rel or tool_input.get("file_path")} is not allowed: only acceptance test files and coverage files'
    if tool_name == 'Bash':
        command = tool_input.get('command', '').strip()
        if HIDDEN_IN_COMMAND.search(command):
            return 'commands may not name implementation or test support folders'
        return None if ALLOWED_COMMANDS.match(command) else 'only npm test, npx vitest run and npx eslint (from backend/) are allowed'
    return f'{tool_name} is not available to the acceptance test writer'


def main():
    call = json.load(sys.stdin)
    reason = refusal(call.get('tool_name', ''), call.get('tool_input') or {}, call.get('cwd') or ROOT)
    if reason:
        print(json.dumps({'hookSpecificOutput': {
            'hookEventName': 'PreToolUse',
            'permissionDecision': 'deny',
            'permissionDecisionReason': f'Black-box rule: {reason}.'
        }}))


main()
