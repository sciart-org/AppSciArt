# Production roadmap

Drafted 2026-10-17. Per-item status and commits live on the [production roadmap board](https://github.com/orgs/sciart-org/projects/4).
- Execute **one phase at a time**, each with its own detailed plan and approval.
- Branching: short-lived branches from `develop`, merged by pull request with CI and a test baseline, deleted once merged (D-055).
- Bug numbers (#…) are the public issues; requirement IDs (UC/BRU/FRQ/IRQ/NFRQ) → `srs-coverage.md`.

## Phase 0 — Repo baseline
- [x] 0.1 Store analyses (local, private) + memories
- [x] 0.2 Make WIP safe: `resend.js` recipient + `EMAIL_REDIRECT_TO` (non-production only); `userHackathonsService` emit `previousGroupId`; testing seeder `down()` scoped to seeded users; `.gitignore` (`docs/*` + `!docs/diagrams/`, `.vscode/`, `.claude/analysis/`)
- [x] 0.3 Conventional Commits (gitignore · CLAUDE.md+settings · evaluators endpoint · error default msg · group-removal emit · seed enum+TODOs · seeders · email redirect · remove `oas-file.yaml.old`)
- ~~0.4 Fast-forward `develop` to `bachelor_thesis_submision`~~ replaced by `release/v1.0.0` (D-007), itself replaced by short-lived branches (D-055)
- Not in Phase 0: push (ask first), release merge to `main` (after Phases 1–2), deleting the local `.env.old_development`

## Hackathon in production (D-052, D-056, D-078, D-079)
The flow CLOSED / PREPARING → FINISHED is ready in production. Listed in work order; every fix ships with a test
that reproduces it. First deploy as soon as possible (D-078).
- [x] Branching and CI: lint, frontend build, full backend suite with a test baseline (D-055), #235

Before the deploy:
- [ ] Security fixes for this flow (tracked privately)
- [ ] #296: facilitator screens miss live updates after a reconnect (found in the pre-production test, 2026-11-13)
- [ ] A privacy fix for the production logs (tracked privately), if its quick form holds; otherwise after
- [ ] Walkthrough checklist #275 on pre-production (the gate): run with browser automation, the user plays the
  actors needed at the same time
- [ ] Staff accounts created by hand in production (D-079), production env check (no sample account), then
  production deploy
  - After the deploy: open and close the issue listing the released security fixes (D-060)

After the deploy, each before its deadline (D-078):
- [ ] Journey test #218, CLOSED / PREPARING → FINISHED (`testing/plan.md` §4.9b): before the next release
- [ ] DB backup #237 (D-077): before real participants' data reaches production
- [ ] Seeder #279 in `seeders/production/` (D-079): staff (data in a gitignored file, idempotent) and the
  next-edition and hackathon block, or PLANNED → CLOSED (#225): before the next hackathon
- [ ] `.env.example` per package (#236)
- [ ] Rest of the hardening for this milestone (tracked privately)
- [ ] Stretch: PLANNED → CLOSED (#225)
- Out of scope: #228, #226, ratings persistence (#229), minor bugs, loading past editions (Phase 5d)
- Open: product owner question on real participants' personal data
- Verify: CI green; checklist passes on pre-production; seeder re-run changes nothing; journey test green before the
  next release

## Hackathon MVP (2026-11-03) — done
Ongoing hackathon from CLOSED / PREPARING to FINISHED on pre-production (D-048, D-049, D-051).
- [x] Product owner answers for the flow (D-049)
- [x] Demo seeders (#274, D-050)
- [x] Pre-production deploy and seeding
- [x] Walkthrough on local and pre-production, flow fixes (#227, #275)
- Moved to the production milestone: journey test, security fixes for this flow, `.env.example`, checklist
- Cut (for now): UC-065 submit rubric

## Phase 1a — Acceptance tests from the SRS
Black-box test safety net before any fix (D-012). Plan and steps: `testing/plan.md`.

## Phase 1 — Security fixes
Tracked privately; described here only once released, in one issue per production release (D-060).

## Phase 2 — Functional bugs
- [ ] #225 State classes return `{ canAdvance, errorMessage }`; fix `phase`/`state` message
- [ ] #226 `isOnSite` inversion
- [ ] #227 Scope maps keyed by `role.name` (internal role is already `ROLES.STAFF`)
- [ ] #228 Migration: drop `evaluators_userProfileId_unique`
- On hold (D-062): #229 `seed_ratings` table; ratings stay in memory until a reason to store them appears
- [ ] #230 Migrations: seed state enum/default (convert `IN_BLANK` rows), `Edition.name` unique, `user_profiles.id` default, FK indexes; fix `handle_new_user.sql` (`authId`)
- [ ] #231 Frontend `socket.off` cleanups + functional `setState` in `HackathonManagement`
- [ ] #232 `authService` null guard; email regex (escape `-`); `customErrorHandler` null body; `joinMeHackathon` nesting; `EditionActionButton`; `Carousel`
- Verify: PLANNED→OPEN→CLOSED→phases→FINISHED; meet link only ONLINE/HYBRID; evaluator in 2 hackathons; ratings survive restart; `db:migrate:test` + down/up round-trip

## Phase 3 — Production foundations
- [ ] Backend integration tests (Vitest + Supertest) on `testing` DB; regression tests for Phases 1–2
- [ ] Playwright smoke tests (`baseURL`, `webServer`), run in CI (chromium); delete template spec
- [x] Root `.github/workflows/ci.yml` (lint, build, backend tests, D-055, #235); `frontend/.github` deleted
- [ ] Deploy config (hosting: D-008) + `.env.example` per package
- [ ] DB with backups + restore drill (NFRQ-017) — Supabase paid plan or alternative
- [ ] `engines`/`.nvmrc`; `concurrently` for root scripts; root README (NFRQ-003)
- [ ] Production hardening (tracked privately)
- [ ] Seeders idempotent; fix broken migration `down()`s (document, never rename applied migrations)

## Phase 4 — Finish mocked basics
- [ ] TODO first: reassess `srs-coverage.md` in full (snapshot of 2026-10-17, rows updated only as fixes land)
- [ ] UC-009/010 profile edit/view + FRQ-004 visibility (`visibility` JSON column)
- [ ] UC-012 contributions; UC-014–016 likes
- [ ] UC-011 withdraw (BRU-020, FRQ-006)
- [ ] UC-030/045 delete edition/hackathon (BRU-003/013, FRQ-012)
- [ ] UC-027 role management (FRQ-002); UC-028 delete user + data export (NFRQ-009)
- [ ] Staff link and unlink accounts with user profiles by email (D-053)
- [ ] Non-binary gender option (D-061)
- [ ] Private, temporary rating notes per seed (D-062)
- [ ] Seed numbers per edition; groups and teams take their seed's number (D-063)
- [ ] Frontend: `AuthContext`, `<ProtectedRoute role>`, `useFetcher` (loading, `response.ok`, AbortController)

## Phase 5 — Complete SRS workflows (sub-plan each)
- [ ] 5a Seed lifecycle
  - deliver/review/reopen (UC-025/039/040/080, BRU-016–019, FRQ-009/010); delete (UC-026)
  - collaboration invitations with status (UC-021–023, IRQ-012, FRQ-008); applications (UC-017, BRU-033); notes (UC-013)
- [ ] 5b Edition/hackathon rules: close edition (UC-032, BRU-005/006/008), BRU-010/011/012/038/039 in transitions, rubrics table + submit/lock + end condition (UC-065/067, BRU-014/043)
- [ ] 5c Suggested groups/teams (FRQ-023/024) as pure service functions + existing DnD UI
- [ ] 5d Post-hackathon
  - funding (UC-069); continue/leave (UC-073, BRU-027, FRQ-026)
  - fruit CRUD + develop/submit/review/reopen/publish (UC-074/075/071/081/079, BRU-028/029/035)
  - curator's vision (UC-077), exhibition images (UC-076), deadlines (IRQ-006), follow-up (UC-070/078)
  - evaluation results (UC-068), catalogue upload (UC-072, BRU-030)
- [ ] 5e Notifications: `notify(event, recipients, data)` + EJS templates via `addAfterCommit`; FRQ-005–015; retry/outbox table

## Phase 6 — Quality & scale
- [ ] Repositories own all model access; break Roles cycle; states emit events instead of importing sockets
- [ ] Batch/cache Drive image lookups; pagination; per-request role cache
- [ ] Persist diagram state periodically; plan socket.io Redis adapter for multi-instance (NFRQ-005/010)
- [ ] Frontend: dedupe Group/Team & Edition/Hackathon components; a11y + `eslint-plugin-jsx-a11y` (NFRQ-001/016); lazy routes; strings module for i18n (NFRQ-011)
- [ ] Remove unused deps (`zod`, `@google-cloud/local-auth`, `reactflow`, `dotenv`); replace `cls-hooked` with `AsyncLocalStorage`; upgrade `googleapis`
- [ ] Hackathon screens, from the 2026-11-13 review: gender-neutral default avatar; group voice and team speaker
  badges and a labelled control; "Delivered" in green; team creation layout redesign

## Every phase
- CI green (lint, build, `npm run test:back`, `npx playwright test --project=chromium`)
- New tests per implemented use case; manual walkthrough with SRS use-case steps as acceptance script
- Record each step with the `/log-step` skill
