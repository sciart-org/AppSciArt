---
name: test-requirement
description: Write the black-box acceptance tests for one SRS requirement (clarify, fixtures, brief, test-writer agent, coverage check, review, findings). Use when the user asks to test the next requirement or a given use case. Not for implementing features.
argument-hint: "[requirement ID, e.g. UC-006/007; default: the Next in docs/project/README.md]"
---

# Test a requirement

Requirement: $ARGUMENTS

One requirement at a time. Rules: `.claude/rules/acceptance-tests.md`. Plan and split of work:
`docs/project/testing/plan.md`. **Stop** marks a point where the user must answer or approve before going on.

| # | Step | Details |
|---|---|---|
| 1 | Name the requirement | Quote its SRS text (`.claude/private/srs/srs-export.txt`) and its plan lines (`plan.md` §4). |
| 2 | Check for existing answers | Rule at the top of `docs/project/decisions.md`; also `.claude/private/decisions.md`. Cite what exists. |
| 3 | Ask what's left | What the SRS and the clarifications don't settle, **including the exact allowed response fields per role** (the YAML validation is incomplete; never use it). **Stop.** |
| 4 | Record new answers | `docs/project/clarifications/<UC>.md` (current truth) + a row in `docs/project/decisions.md` (history). |
| 5 | Private expectations | If `.claude/private/testing-expectations.md` has rows for this requirement, ask the user how to brief them: public briefs can't name them. **Stop.** |
| 6 | Add missing fixtures | Propose (files, why, infra tests). **Stop.** Build, document in `backend/tests/HELPERS.md`, separate commit. |
| 7 | Write the brief | `docs/project/testing/briefs/<ID>.md` from the template in `briefs/README.md`: SRS text, link to the clarification file, vocabulary, numbered cases `**B<n>**`, fixture notes. |
| 8 | Launch the agent | `acceptance-test-writer`, with only the brief's path. It writes the test file and `briefs/<ID>.coverage.json`, self-checks each case, runs, lints and reports. A hook blocks every other read, write and command. |
| 9 | Check coverage | From `backend/`: `python3 -I ../docs/project/tools/check_brief_coverage.py ../docs/project/testing/briefs/<ID>.md tests/acceptance/<file>.test.js` (every case has a test, no test without a case, no stale names). |
| 10 | Review | Each case's assertions against the brief and the SRS. Run the suite; split tests so each red has one cause. |
| 11 | Log reds | `T<n>` in `.claude/private/findings.md` (cause checked in code). Non-security reds also get a public bug item (`/log-step`). |
| 12 | Close | Explain each test to the user, then commit on approval (`commit` skill) and run `/log-step`. **Stop** before committing. |
