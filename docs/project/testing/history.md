# Testing plan history

Frozen record of how the acceptance testing plan was decided. The current plan is `plan.md`.

## v1 rejected (2026-10-19)
- v1 derived its expectations from the code; the user rejected it.
- v2 is black-box: every expectation comes from the SRS, never from the implementation (D-013).

## Who writes the tests: options (decided A, 2026-10-20)
Why: the main session has read the implementation, so it isn't a clean black-box author. Options:
- **A (recommended)**: a fresh subagent writes the tests in each step, given only: `srs-export.txt`, the API spec
  files, the socket event list, this plan and the §9 answers. I review the tests against the SRS and run them.
- **B**: I write them, citing the SRS line for every assertion, and you review that no expectation comes from code.

Decided: option A (D-016). Since 2026-10-23 the agent works from one brief per test file (D-030).

## A1 result (2026-10-20)
Built as proposed, with these differences:
- Branch `tests/acceptance` (a `test` branch exists, so `test/…` is impossible).
- Fakes can't use `vi.mock`: oas-tools imports the controllers with Node's own `import()`. `src/` is externalized in
  `vitest.config.js` and a Node resolve hook maps `googleapis`/`resend` to the fakes; fake state lives on
  `globalThis`; startup aborts if the app didn't load both fakes.
- Smoke test covers health, login, forged tokens, edition/seed/hackathon/group/team fixtures and Drive templates,
  sockets, outbox. Use-case tests start in A2.
- Groups/teams fixtures already included; rubric fixtures and a pre-registered-user fixture come with A3/A5.
- Open for A5: the rubric master template (`rubricTemplate`) isn't created by hackathon creation; ask the user how it
  gets there before writing UC-064 tests.

## A1 detailed proposal (2026-10-20, approved)
1. Branch `test/acceptance` from `release/v1.0.0`.
2. `server.js` split: new `src/app.js` builds express app + oas-tools + sockets; `server.js` keeps env, process
   handlers, DB connect, `listen()`. No behaviour change.
3. Backend devDependencies: `vitest`, `supertest`, `socket.io-client`.
4. `backend/tests/support/`: boundary fakes (`googleapis` Drive, `resend` outbox), fixtures named in SRS terms,
   tokens (real login per base user + forged), DB reset per file.
5. `backend/tests/HELPERS.md`: helper API in SRS terms, the only code-facing doc the test-writing agent gets.
6. One infra smoke test (`GET /health`). Use-case tests start in A2 (agent).
7. Local testing stack needed: `supabase start` in `backend/db/test/supabase`, `db:migrate:test`, `db:seed:test`.
   Ask the user whether Claude may run these.
8. Small commits; show changes and wait for an explicit go before each commit.
