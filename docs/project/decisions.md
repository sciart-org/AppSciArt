# Decisions

Append-only log of project decisions, numbered `D-nnn` in date order.
- **Before adding a row:** check this log and `clarifications/` for an answer that already covers the point, also
  implicitly (e.g. a field list that only makes sense if access is allowed). If one exists, cite it instead.
- **Rows are never edited**, details included. A change of mind is a new row naming the replaced one in
  **Supersedes**; only the replaced row's **Status** changes (`superseded by` / `partly superseded by`).
- **Long decisions** get a one-line summary in the table and their full content under [Details](#details).
- **Current product owner answers** are in `clarifications/`; this log keeps their history.
- **Missing numbers** are security-related decisions, kept private until the related fixes are released.

| ID | Date | Topic | Decision | Supersedes | Status |
|---|---|---|---|---|---|
| D-001 | 2026-10-17 | Repository | Security-sensitive analysis (review findings and their locations) is kept out of the repo, because the repo is public. | — | superseded by D-032 |
| D-002 | 2026-10-17 | Repository | `docs/diagrams` stays tracked; rest of `docs/` (memoir, `API_interactions.md`) local. | — | partly superseded by D-032 (`docs/project/` is tracked) |
| D-003 | 2026-10-17 | Repository | `.vscode/` stays local. | — | in force |
| D-004 | 2026-10-17 | Branching | Branching: git-flow, `develop → main`; release merge only after Phases 1–2. | — | in force |
| D-006 | 2026-10-19 | Priority | Priority: ship what is already implemented (Phases 0–3), new SRS features after the first release. | — | in force |
| D-007 | 2026-10-19 | Branching | Branch `release/v1.0.0` (from `bachelor_thesis_submision`) holds all production prep until the merge to `main`. | — | in force |
| D-008 | 2026-10-19 | Hosting | Hosting as defined in the memoir (§4.6): Netlify, Render, Supabase Cloud, Google Drive, Resend; pre-production auto-deploys. ([details](#d-008)) | — | in force |
| D-009 | 2026-10-19 | Environments | Environments: **pre-production = `develop`**, **production = `main`**. Flow: `release/v1.0.0` → `develop` (verify on pre-prod) → `main`. | — | in force |
| D-010 | 2026-10-19 | Hosting | **Free plans only** on every service for now; their limits shape Phases 2–3. ([details](#d-010)) | — | in force |
| D-012 | 2026-10-19 | Priority | Tests come first: Phase 1a (testing foundation) before any fix, focused on what already works. | — | in force |
| D-013 | 2026-10-19 | Testing | Testing plan v2: black-box from the SRS, bugs show red, silent cases asked to the user first (v1 from code rejected). | — | in force |
| D-014 | 2026-10-20 | Product owner | Testing §9 answered: staff hierarchy (designer ⊃ facilitator), required fields for announcing, meet link only before start, facilitator marks assistance, reopen maps/flowers is a requirement. Open: 3b, 4b, 7b, 8, 9. | — | in force |
| D-015 | 2026-10-20 | Product owner | Edition order PLANNED → ACTIVE → CLOSED → PUBLISHED (published: catalogue compulsory, no edits). Meet link not needed to announce. Gap tests deferred, listed in plan §4.11. | — | in force |
| D-016 | 2026-10-20 | Product owner | §9 closed: admins can do designer+facilitator tasks; tests written by a fresh agent without source access; CLOSED editions visible to guests with the ongoing ones. | — | in force |
| D-017 | 2026-10-20 | Test infrastructure | A1 test infrastructure: branch `tests/acceptance`, Vitest 5, third-party services swapped by a Node resolve hook. ([details](#d-017)) | — | in force |
| D-019 | 2026-10-20 | Test infrastructure | Testing DB seeding is not tracked (no `SequelizeData`), so `db:seed:test` must not be re-run on a seeded DB. The test reset keeps the 60 base users and restores their staff roles. | — | in force |
| D-020 | 2026-10-20 | Testing | Tests go one requirement at a time: ask validation constraints first (the YAML validation is incomplete, not a source), add fixtures if needed, then write the tests. First: UC-002. | — | in force |
| D-021 | 2026-10-20 | UC-002 | UC-002: one list with state, no order; guest `?state=PLANNED` → 401, participant → 403; staff see PLANNED unfiltered; items carry name, year, short description, logo link (compulsory for non-planned). Logo also required to announce (BRU-004). | — | in force |
| D-022 | 2026-10-20 | Testing | Response shapes are tested exactly (required + allowed optional, nothing else). UC-002 item: id, state, name, year, shortDescription, logo, optional fruitLogo. | — | in force |
| D-023 | 2026-10-20 | UC-002 | UC-002: staff list items also carry driveLink (edition Drive folder); never sent to guests or participants. | — | in force |
| D-024 | 2026-10-20 | UC-003 | UC-003: details fields = list public set + longDescription + catalogLink (published only), staff + driveLink; finished = PUBLISHED; fruit summary moves to a separate fruits-by-edition endpoint (tested with UC-006); PLANNED by id → 404 for guest/participant, unknown → 404. | — | partly superseded by D-025 |
| D-025 | 2026-10-20 | UC-003 | Correction to UC-003: fruits ARE in the details of a PUBLISHED edition, each {id, mainImage, title}, same for staff; guests/participants get only published fruits. | part of D-024 | in force |
| D-026 | 2026-10-20 | Fixtures | State consistency rules for fixtures (plan §9 Q14): closed/published editions only have finished hackathons; fruits only for finished hackathons + published flowers, any state; unpublished fruits hidden from everyone in edition details. | — | in force |
| D-027 | 2026-10-22 | Tracking | GitHub tracking: board #4 for repo issues, private board #5 for security drafts, synced from a manifest. ([details](#d-027)) | — | in force |
| D-028 | 2026-10-22 | UC-004 | UC-004 list: visibility, filters and exact item shape (plan §9 Q15). ([details](#d-028)) | — | partly superseded by D-029 |
| D-029 | 2026-10-23 | UC-004 | UC-004 filters changed: the hackathon list has no filter. Only `closest` and `active` remain; both return one hackathon and are tested with hackathon details. `incoming` (and `previous`) dropped. | part of D-028 | in force |
| D-030 | 2026-10-23 | Testing | Acceptance tests are written by the `acceptance-test-writer` agent from one brief per test file. ([details](#d-030)) | — | partly superseded by D-032 (agent tracked) |
| D-032 | 2026-10-23 | Docs | Project docs restructured: public docs in `docs/project/`, security-sensitive material private and untracked. ([details](#d-032)) | D-001 and parts of D-002 and D-030 | in force |
| D-033 | 2026-10-23 | Docs | The SRS text export stays private (untracked); the memoir PDF is kept only in the thesis OneDrive folder, not in the checkout. | — | in force |
| D-034 | 2026-10-23 | Docs | Product owner answers live in `docs/project/clarifications/` (one file per use case, current truth only, edited in place; this log keeps the history). Briefs link their clarification file instead of quoting it, and the test-writing agent may read that folder. | — | in force |
| D-035 | 2026-10-23 | Tracking | Issue #258 (board item 3.9, Phase 3) tracks the docs restructure. | — | in force |
| D-036 | 2026-10-23 | Product owner | Participant = authenticated user without a staff role. Guests and participants see every announced edition (`ACTIVE`, `CLOSED`, `PUBLISHED`). | — | in force |

## Details

### D-008
- Frontend: **Netlify** (`frontend/public/_redirects` exists).
- Backend: Express + Socket.IO as a **Render** web service (`npm start`).
- Postgres + Auth on **Supabase Cloud**; Google Drive (US Google Workspace); Resend (`info@appsciart.ovh`).
- A pre-production environment auto-deploys on push (§5.7).

### D-010
- Consequences for Phase 2–3 (verify current limits then):
  - Render free sleeps when idle (cold starts, in-memory socket state lost on every sleep/redeploy → seed ratings (#229) and diagram sync must not rely on memory).
  - Render free monthly instance hours are shared by pre-prod and prod services.
  - Supabase free pauses idle projects (`keep_supabase_alive.yml`) and has no backups → NFRQ-017 needs our own scheduled `pg_dump` stored somewhere **private** (not public-repo artifacts; e.g. the Drive workspace).
  - Resend free has a daily email cap.

### D-017
- Branch `tests/acceptance` (`test/acceptance` impossible, a `test` branch exists).
- oas-tools imports controllers natively, so `vi.mock` can't reach services: `src/` is externalized and `googleapis` / `resend` are swapped by a Node resolve hook (`tests/support/fakes/hooks.js`).
- The run aborts if the app didn't load both fakes. Google creds are blanked in the test env as a second guard.

### D-027
- #4: repo issues for normal work; the board itself stays private.
- #5: private; security work is tracked only as drafts there.
- Old project #1 and the US-xx issues untouched. Both new boards linked to the repo.
- Manifest `github-project.json` + `sync_project.py` keep them in sync after each step.

### D-028
- Visibility: guests/participants see non-planned, non-private hackathons (ongoing count as incoming); private and planned ones staff only, also within filters.
- Filters: none = all, incoming = ends after now, previous = ended, active = enrolled + started + not ended (guest → 401); `closest` deferred to hackathon details. No order.
- Item: id, state, phase, type, startDate, endDate, shortDescription, location, logo, editionName, + isEnrolled (auth only, participation only, evaluators don't count).
- Staff: + internalName, isPrivate, driveLink. Never meetLink.

### D-030
- Agent in `.claude/agents/`, model inherit, launched with only a brief file (`briefs/<ID>.md`).
- A PreToolUse hook enforces the black-box sources; the agent writes only the test file and its coverage map; fixtures stay with the main session.
- Each file is checked against its brief: `check_brief_coverage.py` (structural) + main session's per-case review.

### D-032
- Public: `docs/project/` (index and status, decisions, roadmap, SRS coverage, product owner clarifications, testing plan and briefs, tools).
- Private, untracked: security-sensitive material in a private folder; private working instructions in `CLAUDE.local.md`.
- Tracked in `.claude/`: the test-writing agent, its hook, the skills and the path-scoped rules.
- Migrated in steps, each approved.
