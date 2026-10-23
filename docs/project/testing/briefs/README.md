# Briefs for the acceptance test writer

One brief per acceptance test file. The main session writes it, and the `acceptance-test-writer` agent
(`.claude/agents/acceptance-test-writer.md`) is launched with only its path. The brief is exactly what the agent got.
The agent's fixed rules (allowed sources, style, run and report) live in the agent file, not here.

## Files
| File | Written by | Content |
|---|---|---|
| `<ID>.md` | main session | the brief (template below) |
| `<ID>.coverage.json` | agent | `{ "B1": ["exact test name", …], … }`: which tests cover each case |

## Template
```markdown
# <ID> <use case name> → `backend/tests/acceptance/<file>.test.js`

## Requirement
SRS IDs and where to find them in `srs-export.txt` (line numbers), plus the SRS text quoted.

## Clarifications
Links to the product owner's answers that apply (`docs/project/clarifications/<UC>.md`, sections), plus any
case-specific note. Link, don't quote: the agent reads the clarification files.

## Vocabulary
The SRS-term → API-value mappings that apply (`docs/project/clarifications/general.md`).

## Test cases
- **B1** One expected behaviour, with the actor and the expected result.
- **B2** …

## Fixture notes
Fixtures that matter, consistency rules to respect.
```

Case IDs are written in bold (`**B1**`); `check_brief_coverage.py` reads them. A withdrawn case is struck
through without bold (`~~B17~~`) and stays in the brief with the reason.

## Checking a test file against its brief
1. The agent maps every case to its tests in `<ID>.coverage.json` and adds no test without a case.
2. Main session runs `python3 -I docs/project/tools/check_brief_coverage.py docs/project/testing/briefs/<ID>.md tests/acceptance/<file>.test.js`.
   It runs the file and reports cases with no test, mapped tests that don't exist, tests mapped to no case and
   duplicated names. Exit code 1 on any of them.
3. Main session reviews each case by hand: do the assertions of its tests express exactly the expected
   behaviour in the brief (and the SRS)?
