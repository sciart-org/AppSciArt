# AppSciArt — project docs

Project documentation for AppSciArt: the roadmap to production for ASTER+S, the decisions taken, the product
owner's clarifications of the SRS, and how the acceptance tests are written. Architecture and commands are in the
root `CLAUDE.md`.

Security work is tracked privately and only described here in generic terms until the fixes are released.

## Now
- **Phase:** 1a, acceptance tests from the SRS (branch `tests/acceptance`)
- **Done:** UC-002 view editions, UC-003 edition details, UC-004 view hackathons
- **Next:** UC-006 / UC-007

## Phases
| Phase | Scope | Issue | Status |
|---|---|---|---|
| 0 | Repository baseline | #164 | done |
| 1a | Acceptance tests from the SRS | #165 | in progress |
| 1 | Security fixes (tracked privately) | — | todo |
| 2 | Functional bugs | #166 | todo |
| 3 | Production foundations (CI, ops, hardening) | #167 | todo |
| 4 | Finish mocked basics | #168 | todo |
| 5 | Complete SRS workflows | #169 | todo |
| 6 | Quality and scale | #170 | todo |

Per-item status and commits live on the [production roadmap board](https://github.com/orgs/sciart-org/projects/4).

## Layout
| Path | Content |
|---|---|
| `README.md` | This index and the current status |
| `decisions.md` | Numbered, dated decision log; append-only |
| `roadmap.md` | Phases as checklists with verification steps |
| `srs-coverage.md` | Coverage of each SRS use case by the current code |
| `clarifications/` | Product owner answers per use case where the SRS is silent; current truth only |
| `testing/plan.md` | Acceptance test scope, plan per use case, execution steps |
| `testing/briefs/` | One brief per acceptance test file, for the test-writing agent |
| `tools/` | Scripts for briefs and board sync |
| `tracking/` | Source of the production roadmap board |

Claude Code configuration that supports this work: `.claude/agents/` (acceptance test writer), `.claude/skills/`,
`.claude/rules/` (rules loaded only when working on matching files).

## How a requirement flows
SRS → product owner answer (entry in `decisions.md` + `clarifications/<UC>.md`) → brief → test → bug issue.
A changed answer adds a new decision that supersedes the old one, edits the clarification in place, and updates the
briefs and tests that depend on it.
