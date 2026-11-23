# AppSciArt — project docs

Project documentation for AppSciArt: the roadmap to production for ASTER+S, the decisions taken, the product
owner's clarifications of the SRS, and how the acceptance tests are written. Architecture and commands are in the
root `CLAUDE.md`.

Security work is tracked privately and only described here in generic terms until the fixes are released.

## Now
- **Milestone:** Hackathon in production (D-052, D-056, `roadmap.md`): the flow CLOSED / PREPARING → FINISHED ready
  in production
- **Done:** Hackathon MVP on pre-production (D-048–D-051); CI with a test baseline and branch protection (D-055)
- **Now:** the security fixes for the flow
- **Next:** the journey test (#218)
- **Paused:** Phase 1a after UC-006 / UC-007; next there: FRQ-001 authentication

## Phases
| Phase | Scope | Issue | Status |
|---|---|---|---|
| 0 | Repository baseline | #164 | done |
| 1a | Acceptance tests from the SRS | #165 | in progress |
| 1 | Security fixes (tracked privately) | — | in progress |
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
| `testing/consistency.md` | Fixture consistency rules: source, check, infra test |
| `testing/history.md` | Frozen record of how the testing plan was decided |
| `tools/` | `check_brief_coverage.py` (brief vs test file), `check_clarifications.py` (answers in force are cited), `sync_project.py` (board sync) |
| `tracking/` | Source of the production roadmap board |

The docs site (`website/`, D-054, D-059) publishes this folder, `docs/diagrams/`, `CLAUDE.md` and
`backend/tests/HELPERS.md` in place.

### Where new information goes
| New information | Goes to |
|---|---|
| A decision or a product owner answer | the `decision` skill: a row in `decisions.md`, plus `clarifications/<UC>.md` and SRS changes when they apply |
| A fact about how code or tooling works | the doc for that thing: `CLAUDE.md` (architecture, commands, code style), `backend/tests/HELPERS.md` (test helpers), `tracking/README.md` (boards) |
| A fixture consistency rule | `testing/consistency.md` |
| A rule for writing tests | `.claude/rules/acceptance-tests.md` |
| A repeatable procedure, or a rule about how to work | the skill it belongs to in `.claude/skills/` |
| A bug seen while using the app | `/bug`: a finding, then a board item |
| A bug found while changing code | fixed in the change if only the change has it; otherwise `/bug` ("Found while fixing") |
| A red test | a finding and a bug issue via `/log-step`; security-related ones stay private |
| A finished step | `/log-step`: board item, "Now", roadmap tick, sync |
| Anything security-sensitive | the private folder only, until the fix is released |

## How a requirement flows
SRS → product owner answer (entry in `decisions.md` + `clarifications/<UC>.md`) → brief → test → bug issue.
A changed answer adds a new decision that supersedes the old one, edits the clarification in place, and updates the
briefs and tests that depend on it.
