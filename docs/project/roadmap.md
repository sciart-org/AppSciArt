# Production roadmap

Drafted 2026-10-17. Per-item status and commits live on the [production roadmap board](https://github.com/orgs/sciart-org/projects/4).
- Execute **one phase at a time**, each with its own detailed plan and approval.
- Branching: git-flow as in D-004; feature branches `fix/…`, `feat/…` from `develop`.
- Bug numbers (#…) are the public issues; requirement IDs (UC/BRU/FRQ/IRQ/NFRQ) → `srs-coverage.md`.

## Phase 0 — Repo baseline
- [x] 0.1 Store analyses (local, private) + memories
- [x] 0.2 Make WIP safe: `resend.js` recipient + `EMAIL_REDIRECT_TO` (non-production only); `userHackathonsService` emit `previousGroupId`; testing seeder `down()` scoped to seeded users; `.gitignore` (`docs/*` + `!docs/diagrams/`, `.vscode/`, `.claude/analysis/`)
- [x] 0.3 Conventional Commits (gitignore · CLAUDE.md+settings · evaluators endpoint · error default msg · group-removal emit · seed enum+TODOs · seeders · email redirect · remove `oas-file.yaml.old`)
- ~~0.4 Fast-forward `develop` to `bachelor_thesis_submision`~~ replaced: work accumulates on `release/v1.0.0` (D-007)
- Not in Phase 0: push (ask first), release merge to `main` (after Phases 1–2), deleting local files (`.env.old_development`, `.Rhistory`, `fake.png`)

## Phase 1a — Acceptance tests from the SRS
Black-box test safety net before any fix (D-012). Plan and steps: `testing/plan.md`.

## Phase 1 — Security fixes
Tracked privately; described here only once released.

## Phase 2 — Functional bugs
- [ ] #225 State classes return `{ canAdvance, errorMessage }`; fix `phase`/`state` message
- [ ] #226 `isOnSite` inversion
- [ ] #227 Scope maps keyed by `role.name`; replace `INTERNAL_BACKEND_ROLE` with `ROLES.STAFF`
- [ ] #228 Migration: drop `evaluators_userProfileId_unique`
- [ ] #229 `seed_ratings` table (participationId, seedId, rating, submittedAt); sockets persist; lock after submit (BRU-042)
- [ ] #230 Migrations: seed state enum/default (convert `IN_BLANK` rows), `Edition.name` unique, `user_profiles.id` default, FK indexes; fix `handle_new_user.sql` (`authId`)
- [ ] #231 Frontend `socket.off` cleanups + functional `setState` in `HackathonManagement`
- [ ] #232 `authService` null guard; email regex (escape `-`); `customErrorHandler` null body; `joinMeHackathon` nesting; `EditionActionButton`; `Carousel`
- Verify: PLANNED→OPEN→CLOSED→phases→FINISHED; meet link only ONLINE/HYBRID; evaluator in 2 hackathons; ratings survive restart; `db:migrate:test` + down/up round-trip

## Phase 3 — Production foundations
- [ ] Backend integration tests (Vitest + Supertest) on `testing` DB; regression tests for Phases 1–2
- [ ] Playwright smoke tests (`baseURL`, `webServer`); delete template spec
- [ ] Root `.github/workflows/ci.yml` (lint, build, backend tests, Playwright chromium); delete `frontend/.github`
- [ ] Deploy config (hosting: D-008) + `.env.example` per package
- [ ] DB with backups + restore drill (NFRQ-017) — Supabase paid plan or alternative
- [ ] `engines`/`.nvmrc`; `concurrently` for root scripts; root README (NFRQ-003)
- [ ] Production hardening (tracked privately)
- [ ] Seeders idempotent; fix broken migration `down()`s (document, never rename applied migrations)

## Phase 4 — Finish mocked basics
- [ ] UC-009/010 profile edit/view + FRQ-004 visibility (`visibility` JSON column)
- [ ] UC-012 contributions; UC-014–016 likes
- [ ] UC-011 withdraw (BRU-020, FRQ-006)
- [ ] UC-030/045 delete edition/hackathon (BRU-003/013, FRQ-012)
- [ ] UC-027 role management (FRQ-002); UC-028 delete user + data export (NFRQ-009)
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

## Every phase
- CI green (lint, build, `npm run test:back`, `npx playwright test --project=chromium`)
- New tests per implemented use case; manual walkthrough with SRS use-case steps as acceptance script
- Update the status: `README.md` "Now", then the board item
