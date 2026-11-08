# Decisions

Append-only log of project decisions, numbered `D-nnn` in date order.
- **Before adding a row:** check this log and `clarifications/` for an answer that already covers the point, also
  implicitly (e.g. a field list that only makes sense if access is allowed). If one exists, cite it instead.
- **Rows are never edited**, details included. A change of mind is a new row naming the replaced one in
  **Supersedes**; only the replaced row's **Status** changes (`superseded by` / `partly superseded by`).
- **Long decisions** get a one-line summary in the table and their full content under [Details](#details).
- **Current product owner answers** are in `clarifications/`; this log keeps their history.
  - An answer goes into `clarifications/` in the same commit as its row, never "later".
  - `tools/check_clarifications.py` fails while an answer in force is cited in no clarification file.
- **Missing numbers** are security-related decisions, kept private until the related fixes are released.

| ID | Date | Topic | Decision | Supersedes | Status |
|---|---|---|---|---|---|
| D-001 | 2026-10-17 | Repository | Security-sensitive analysis (review findings and their locations) is kept out of the repo, because the repo is public. | — | superseded by D-032 |
| D-002 | 2026-10-17 | Repository | `docs/diagrams` stays tracked; rest of `docs/` (memoir, `API_interactions.md`) local. | — | partly superseded by D-032 (`docs/project/` is tracked) |
| D-003 | 2026-10-17 | Repository | `.vscode/` stays local. | — | in force |
| D-004 | 2026-10-17 | Branching | Branching: git-flow, `develop → main`; release merge only after Phases 1–2. | — | partly superseded by D-055 (git-flow; `develop → main` stays) |
| D-006 | 2026-10-19 | Priority | Priority: ship what is already implemented (Phases 0–3), new SRS features after the first release. | — | in force |
| D-007 | 2026-10-19 | Branching | Branch `release/v1.0.0` (from `bachelor_thesis_submision`) holds all production prep until the merge to `main`. | — | superseded by D-055 |
| D-008 | 2026-10-19 | Hosting | Hosting as defined in the memoir (§4.6): Netlify, Render, Supabase Cloud, Google Drive, Resend; pre-production auto-deploys. ([details](#d-008)) | — | in force |
| D-009 | 2026-10-19 | Environments | Environments: **pre-production = `develop`**, **production = `main`**. Flow: `release/v1.0.0` → `develop` (verify on pre-prod) → `main`. | — | partly superseded by D-055 (flow) |
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
| D-025 | 2026-10-20 | UC-003 | Correction to UC-003: fruits ARE in the details of a PUBLISHED edition, each {id, mainImage, title}, same for staff; guests/participants get only published fruits. | part of D-024 | partly superseded by D-041 |
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
| D-039 | 2026-10-23 | UC-002/003 | Staff `?state=PLANNED` → only `PLANNED` editions. Non-published edition details: `fruits` absent or empty, either is fine. | — | partly superseded by D-041 |
| D-040 | 2026-10-23 | UC-003 | A fruit's `mainImage` in edition details is a link, like the edition `logo`. | — | in force |
| D-041 | 2026-10-23 | UC-003 | Every non-planned edition (`ACTIVE`, `CLOSED`, `PUBLISHED`) can have fruits; its details list only the published ones (extends the SRS, which names only finished editions). | fruits part of D-025; non-published part of D-039 | in force |
| D-042 | 2026-10-23 | UC-006 | UC-006: list per type by `editionId`; guests and participants see published products only, staff every state; private hackathon doesn't hide published products; exact item fields. ([details](#d-042)) | — | in force |
| D-043 | 2026-10-23 | UC-007 | UC-007: published details for everyone; unpublished → staff and its authors, others `404`; exact fields per type, `driveLink` and `template` for staff and authors only. ([details](#d-043)) | — | partly superseded by D-044 |
| D-044 | 2026-10-30 | UC-007 | UC-007: related products in details are the related product's own details for the same viewer (flower `seed`; fruit `flower` without its `seed`, fruit `seed` plus the fruit's `description`). ([details](#d-044)) | related items of D-043 | in force |
| D-045 | 2026-10-30 | UC-006/007 | Evaluators see products of every state in lists and details, like staff. `driveLink` and `template` stay for staff and the product's authors only, on every product and related item. | — | partly superseded by D-046 |
| D-046 | 2026-10-30 | UC-006/007 | Evaluators see unpublished flowers and fruits only of the hackathons they evaluate, and get their `driveLink` and `template`. Seeds: like participants. Inspiring scientists get `driveLink` and `template` only of their own seeds. | evaluator part of D-045 | in force |
| D-048 | 2026-11-01 | Priority | Hackathon MVP before the 2026-11-03 product owner meeting: an ongoing hackathon runs from CLOSED / PREPARING to FINISHED on pre-production, tested internally by the team. Phase 1a pauses after UC-006/007 and resumes after the meeting. ([details](#d-048)) | — | partly superseded by D-049 |
| D-049 | 2026-11-02 | Product owner | Hackathon MVP flow answered (PREPARING → FINISHED): staff drive phases and can force them, only staff mark assistance, any enrolled participant can enter, groups and teams each take a different seed, UC-065 in scope but not needed to end. Milestone plan compressed. ([details](#d-049)) | D-048 (scope: UC-065 added) | partly superseded by D-051, D-052 |
| D-050 | 2026-11-03 | Tooling | Seed data is organised by purpose, not by environment: one sample dataset (`seeders/sample/`, built from shared factories, real Drive folders) for development and pre-production, rebuilt with `db:reset`; production gets no sample data. ([details](#d-050)) | — | partly superseded by D-052 |
| D-051 | 2026-11-03 | Priority | Hackathon MVP order changed on meeting day: a local walkthrough found and fixed the flow bugs, and the journey test moves to after the meeting. ([details](#d-051)) | D-049 (milestone order) | in force |
| D-052 | 2026-11-06 | Priority | Hackathon in production: a real hackathon runs from CLOSED / PREPARING to FINISHED in production, loaded by a real-data seeder whose data stays out of the repo. Every fix ships with a test that reproduces it. ([details](#d-052)) | D-049 (cut order), D-050 (no data in production) | partly superseded by D-056 |
| D-053 | 2026-11-06 | Requirement | Future requirement, not scheduled now: staff link and unlink an auth account with a user profile (matched by email), so profiles created before their owners sign up get claimed by them. ([details](#d-053)) | — | in force |
| D-054 | 2026-11-08 | Docs | The project docs get a Docusaurus site in `website/` that reads `docs/project/` and `docs/diagrams/` in place (allowlist, plain Markdown), is built on every pull request that touches them, and is deployed to GitHub Pages from `develop`. ([details](#d-054)) | — | in force |
| D-055 | 2026-11-08 | Branching | Short-lived branches from `develop`, merged by pull request. CI runs lint, the frontend build and the full backend suite on every pull request; a committed baseline of passing tests makes any regression, or any new pass left unrecorded, fail the check. ([details](#d-055)) | D-004 (git-flow), D-007, D-009 (flow) | in force |
| D-056 | 2026-11-08 | Priority | Hackathon in production, re-planned: no real hackathon to load yet, so production gets staff and, when known, the next edition's hackathon from the seeder. New order: CI, security fixes, journey test, seeder, ops, checklist and deploy; PLANNED → CLOSED is a stretch goal. ([details](#d-056)) | D-052 (order, seeder scope) | in force |

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

### D-042
- `GET /seeds|flowers|fruits?editionId=`: missing → `400`, unknown → `404`, `PLANNED` edition → `404` for guests and participants.
- Published only for guests and participants (authors included); staff see every state, unlike edition details (D-041).
- Item: seed `id, state, title, mainImage, branchesOfKnowledge, authors`; flower and fruit `id, state, title, mainImage, authors`. Author `{id, name, surname}`.

### D-043
- Unpublished details: staff and the product's authors `200`, others `404`.
- Seed: `id, title, state, branchesOfKnowledge, seedPDF, mainImage, authors` + optional `videoLink, presentationLink, podcastLink, otherImages`.
- Flower: `id, title, concept, state, seed {id}, mainImage, authors` + optional `prototypeImages, inspirationImages, presentation, video`.
- Fruit: `id, title, state, authorVision, curatorVision, flower {id}, seed {id, description}, mainImage, authors` + optional `otherImages`.
- `driveLink` and `template`: staff and authors only.

### D-044
- Flower `seed`: the body `GET /seeds/{id}` returns to the same viewer, so `driveLink` and `template` only for staff and the seed's authors.
- Fruit `flower`: the body `GET /flowers/{id}` returns to the same viewer, without its `seed` (the fruit has its own `seed`).
- Fruit `seed`: the body `GET /seeds/{id}` returns to the same viewer, plus `description`, the seed description stored for that fruit.

### D-048
- Scope: UC-044 start and UC-047–067 except UC-065. Creating, announcing, closing and joining are out of scope;
  the demo hackathon is prepared by seeders.
- Tests: one journey test (plan §4.9) from PREPARING to FINISHED, checking postconditions only. Per-UC tests for
  these use cases follow after the meeting.
- Only bugs the journey test or the walkthrough show are fixed now.
- Priority over D-012 (tests before any fix) for this milestone only.
- Board: the milestone's items carry the label `hackathon-mvp`.

### D-049
Answers for the Hackathon MVP flow. They go into per-UC files in `clarifications/` after the meeting (D-034).

**General**
- The journey test checks postconditions only; exact shapes stay for the per-UC tests (exception to D-022).
- Facilitators, designers and admins advance phases, one at a time, never backwards.
- Staff control the phases, not participants. Where a phase change only warns, the warning is in the UI; the API
  allows it.

**PREPARING (UC-044, UC-047, UC-057)**
- Entering doesn't mark assistance; only staff set it, in any phase while the hackathon is ongoing. May change after
  staff feedback.
- Any enrolled participant can enter, assisting or not (BRU-048); assistance is only an indicator for staff.
- Starting needs ≥1 enrolled participant (BRU-037).

**Groups (UC-058, UC-048, UC-049, UC-059)**
- ≥1 group. Each group has a different seed; seeds without a group are allowed but not preferred.
- GROUP_WORK can't start with an assisting participant without a group (new rule) or a group without a voice
  (BRU-032). A second voice replaces the first.
- A map is readable by its members, staff and evaluators; other participants read only delivered maps of the
  hackathons they're enrolled in.
- GROUP_PRESENTATION can start with undelivered maps (UI warning only).

**Ratings (UC-050, UC-052, UC-060)**
- Only presented seeds are rated; ratings can change until submission.
- A participant submits after all groups have presented, with every presented seed rated. Not every participant
  must submit before TEAM_CREATION.
- Ratings are seen by staff (facilitators, designers, admins) and evaluators; each participant sees their own.

**Teams and flowers (UC-061, UC-053, UC-054, UC-062)**
- One seed per team; teams in the same hackathon can't share a seed; not every seed needs a team. May change later.
- Same membership and speaker rules as groups.
- A member sees the seed, its conceptual map(s) and the team's flower document, where the flower is filled in.
- TEAM_PRESENTATION can start with undelivered flowers (UI warning only).

**Rubrics and end (UC-063–067)**
- One rubric per evaluator × delivered flower from the start of TEAM_PRESENTATION; each evaluator sees only theirs.
- UC-065 (submit rubric) is in scope. Ending doesn't need submitted rubrics.
- After FINISHED, evaluators can still open, edit and submit unsubmitted rubrics; a submitted one is read-only.
- The management view shows evaluators the same as facilitators, read-only (BRU-025).
- The hackathon ends only from TEAM_PRESENTATION, after at least one team has presented.

**SRS changes:** Q2, Q4, Q5, Q12, Q19, Q21 and Q23 change SRS items; recorded with the SRS export.

**Milestone plan (time is short)**
- Order: demo seeder first (local, then pre-prod), journey test and fix loop, redeploy, walkthrough on pre-prod as
  the rehearsal. The local walkthrough is dropped.
- Cut first to last: UC-065, #229, frontend cleanups not seen in the walkthrough, security fixes for this flow
  (tracked privately; if cut, the pre-prod URL stays within the team). Never cut: demo seeder, deploy, flow reaching
  FINISHED.
- Fallback: if pre-prod fails on 2026-11-03, the seeded flow is demoed locally.

### D-050
- Why: the old seeders were split by environment, mixed real catalog data with fake states, depended on each other
  through hard-coded IDs, and pre-production (`NODE_ENV=production` on the server) had no safe folder.
- `NODE_ENV` → seeders folder (`.sequelizerc`): `development` and `pre-production` → `sample/`, `testing` →
  `testing/`, `production` → `production/` (empty). `sampleData.js` refuses to load in any other environment.
- Seeder runs are recorded (`seederStorage: 'sequelize'`), so `db:reset` (undo all, seed all) and
  `db:reset:preprod` rebuild the dataset, Drive folders included.
- Pre-production is seeded from a local `.env.pre-production` (`NODE_ENV=pre-production`); `.env.production` is
  the real production.
- The previous seeders stay in `seeders/old/` as reference; later steps fold them into the sample dataset and share
  the factories with the test fixtures.

### D-051
- The journey test, brief and fix loop of D-049 didn't fit before the meeting. Instead, the team walked the seeded
  hackathon locally from PREPARING to FINISHED and fixed what blocked it (#227, #275).
- The pre-production walkthrough stays the rehearsal. The journey test (#218) comes after the meeting.
- Routine for every run: `db:reset`, restart the backend (presentation and rating state is in memory, #229), reload
  every tab and sign in again.

### D-052
- Why: the product owner wants the first real hackathons in production. They start already closed, so PLANNED →
  CLOSED (#225) isn't needed yet.
- Out of scope:
  - PLANNED → CLOSED: the hackathon is loaded at CLOSED / PREPARING
  - Ratings persistence (#229): ratings are only used until team creation
  - Minor bugs (#276–#278, #231, #232) and response-shape findings
- In scope, in order:

| # | Step | Test |
|---|---|---|
| 1 | Real-data seeder in `seeders/production/` | Two runs on the test DB give the same data |
| 2 | #228: an evaluator in two hackathons | Acceptance test, red before the fix |
| 3 | Security fixes for this flow (tracked privately) | One regression test per fix |
| 4 | Journey test (#218), CLOSED / PREPARING → FINISHED | The production gate |
| 5 | Ops: production env, `.env.example` (#236), DB backup | Smoke on pre-production |
| 6 | Walkthrough checklist (#275) on pre-production, then production deploy | Manual run |

**Real-data seeder**
- The code is tracked; the data (people, seeds, hackathon) is read from a gitignored file. A tracked example file
  with fake values documents the shape.
- Idempotent: find-or-create by natural keys (email, titles), so a re-run never duplicates or deletes. No `down()`
  that wipes real data.
- Participants get user profiles without auth accounts; they claim them by signing up with the same email (D-053).

**Tests for every fix**
- A fix starts with a test that fails for the reason of the bug, then passes. No fix is published without one.
- Security tests are pushed together with their fix, never before it (as in D-038 and D-047).

**Sources**
- Twelve-Factor App, "XII. Admin processes": one-off admin tasks are code shipped with the app and run in the same
  environment.
- Rails Guides, "Active Record Migrations" § "Migrations and Seed Data": seeds should be idempotent.
- *Software Engineering at Google* (Winters, Manshreck, Wright), ch. 11–12: a bug fix comes with a test that
  reproduces it. Feathers, *Working Effectively with Legacy Code*: pin behaviour with tests before changing it.
- GDPR art. 5(1)(f): personal data needs appropriate security, so real names and emails stay out of a public repo.

### D-053
- Terms:
  - **Account:** the real auth data (Supabase `auth.users`)
  - **User profile:** the user's relations with products (authorships, participations, roles)
- Need: past participants are loaded as user profiles before they have an account (D-052). Staff must be able to
  link a profile with an account, or unlink it, by email.
- Today: signing up with direct registration reuses a profile with the same email. Quick registration refuses an
  email that already has a profile.
- Recorded as a new SRS requirement (pending in the SRS changes); planned with role and user management (Phase 4).

### D-054
- Why: the docs were only readable as Markdown on GitHub; a site gives navigation, search-friendly pages and the
  diagrams in one place, with no second copy to keep in sync.
- Layout follows the Docusaurus monorepo convention (a `website/` package next to the apps, as in Jest).
- The docs plugin reads `../docs` with an `include` allowlist (`project/**/*.md`, `diagrams/**/*.md`), so local or
  private material in `docs/` can never be published by accident.
- `markdown.format: 'detect'` parses `.md` as CommonMark, so the existing docs build unchanged.
- CI and deploy follow the Docusaurus guide: one workflow builds on pull requests, another builds and deploys with
  GitHub's official Pages actions (`upload-pages-artifact`, `deploy-pages`), not a `gh-pages` branch.
- Deployed from `develop`, where the docs change day to day; `main` only moves on releases.
- Sources: [Docusaurus deployment, GitHub Actions](https://docusaurus.io/docs/deployment#triggering-deployment-with-github-actions),
  [docs plugin options](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs),
  [Markdown format](https://docusaurus.io/docs/api/docusaurus-config#markdown),
  [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages),
  [Jest `website/`](https://github.com/jestjs/jest/tree/main/website).

### D-055
- Why: work was piling up on long-lived branches (`release/v1.0.0`, `tests/acceptance`), and "every fix ships with a
  test" (D-052) only holds if the tests run on every change.
- Branches:
  - `feat/<issue>-<slug>`, `fix/…`, `test/…`, `docs/…`, `chore/…`, cut from `develop` and merged back by pull request.
  - Kept short: one roadmap step or less, merged as soon as its checks pass.
  - `develop` = pre-production and `main` = production stay as in D-009; `main` only moves on releases.
- Branch protection on `develop` and `main`: the CI checks must pass, and the branch must be up to date with its base.
- CI (`.github/workflows/ci.yml`, on pull requests to `develop` and `main`): lint, frontend build, and the full
  backend suite against a local Supabase stack started in the job.
  - Full suite, no test selection: it runs in about 25 s (962 tests, measured 2026-11-08), far under the
    ten-minute feedback target. Selection pays off only for suites of hundreds of thousands of tests.
  - Revisit when the UI tests (#221) push the run towards ten minutes: API tests on every pull request, UI tests in
    a later stage.
- Test baseline (a ratchet):

| Situation | `npm run test:baseline` (local) | CI |
|---|---|---|
| A test passes and isn't in the baseline | adds it | fails: record it |
| A test in the baseline fails | refuses, lists it | fails: regression |
| A test must leave the baseline | only with a flag naming it, visible in the diff | — |

- Baseline rules:
  - `backend/tests/baseline.json` lists only passing tests (file + full name), sorted, committed and reviewed.
  - Tests stay where they are; no `skip` or `it.fails` marks.
  - Flaky tests are fixed, never recorded. None found: three full runs on 2026-11-08 gave identical results.
  - Only passing tests are named, so no tracked file lists open security tests.
- Not adopted:
  - Test selection (Google, Meta, `vitest --changed`): all our tests are black-box and load the whole app, and
    import graphs miss changes to the API spec and migrations.
  - Merge queue: it solves concurrent merges by many people; with one developer, the up-to-date rule gives the same
    guarantee.
- Sources:
  - [DORA, trunk-based development](https://dora.dev/capabilities/trunk-based-development/) and
    [test automation](https://dora.dev/capabilities/test-automation/) (current): short-lived branches; test feedback
    in under ten minutes, locally and in CI.
  - [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow) (current docs);
    [Driessen, "A successful Git branching model", note of reflection](https://nvie.com/posts/a-successful-git-branching-model/)
    (2020): git-flow's author recommends GitHub flow for continuously delivered web apps.
  - Expectation files: [Chromium web test expectations](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/testing/web_test_expectations.md),
    [web-platform-tests metadata](https://web-platform-tests.org/tools/wptrunner/docs/expectation.html),
    [Betterer results file](https://phenomnomnominal.github.io/betterer/docs/results-file),
    [pytest `xfail_strict`](https://docs.pytest.org/en/stable/how-to/skipping.html) (all current docs).
  - Test selection at scale: [Future of Google Testing, ICST](https://conf.researchr.org/details/icst-2024/cciw-2024-papers/3/Future-of-Google-Testing)
    (2024), [Regression Test Selection at Scale](https://research.google/pubs/regression-test-selection-at-scale-4/)
    (Google, 2026), [Predictive Test Selection](https://arxiv.org/abs/1810.05286) (Meta, 2019, background),
    [Vitest `--changed`](https://vitest.dev/guide/cli.html) (current).
  - [How GitHub uses merge queue](https://github.blog/engineering/engineering-principles/how-github-uses-merge-queue-to-ship-hundreds-of-changes-every-day)
    (2024).

### D-056
- Why: the Genetics 2026 edition has already finished and the next edition isn't open yet, so there is no real
  hackathon to load at CLOSED / PREPARING (D-052).
- Goal unchanged: the flow CLOSED / PREPARING → FINISHED is ready in production, with the security fixes and a
  test for every fix.
- Order:

| # | Step | Test |
|---|---|---|
| 1 | Branching and CI (D-055) | CI green on its own pull request |
| 2 | Security fixes for this flow (tracked privately) | One regression test per fix |
| 3 | Journey test (#218), CLOSED / PREPARING → FINISHED | The production gate |
| 4 | Seeder in `seeders/production/`: staff, plus an optional block for the next edition and its hackathon | Two runs on the test DB give the same data |
| 5 | Ops: production env, `.env.example` (#236), DB backup | Smoke on pre-production |
| 6 | Walkthrough checklist (#275) on pre-production, then production deploy | Manual run |
| 7 | Stretch: PLANNED → CLOSED (#225) | Acceptance tests |

- Seeder:
  - Staff get profiles and role rows without accounts; they claim them by signing up with the same email (D-053).
  - The next-edition block (edition, seeds, scientists, hackathon, participants) loads the next real hackathon at
    CLOSED / PREPARING if PLANNED → CLOSED isn't ready in time. The seeder creates its Drive folders.
  - The rest of D-052 still holds: data in a gitignored file, a tracked example, find-or-create by natural keys.
  - Built last, when the next edition's data exists, so its shape follows real data, not guesses.
- Validation without a real hackathon: the journey test, plus the rehearsal on pre-production (D-051).
- Out of scope, added to D-052's list:
  - #228 (an evaluator in two hackathons): there is only one hackathon at a time for now.
  - #226 (meet link on on-site hackathons).
  - Loading past editions, their hackathons and works: later, with the post-hackathon stage (Phase 5d), and once
    profiles without an email are decided.
- Open: a product owner question on real participants' personal data in production (privacy notice, legal basis).
- Sources: D-052's sources for the seeder still apply.
