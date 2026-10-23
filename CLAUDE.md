# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

AppSciArt is a monorepo with an Express/Sequelize backend in `backend/` and a React 19/Vite frontend in `frontend/`. The platform manages SciArt editions, hackathons, and the "products" created in them (seeds → flowers → fruits). Auth is handled by Supabase, the database is Postgres, and real-time hackathon features use socket.io.

## Commands

Run from the repo root:
- `npm run dev`: backend (port 3000, `NODE_ENV=development`) and frontend (Vite, `VITE_API_URL=http://localhost:3000`)
- `npm run test:dev`: backend against the **testing** DB, plus the frontend
- `npm run lint` / `npm run lint:fix`: both packages. Husky pre-commit runs lint-staged (`lint:fix`) on staged files.

Run from `backend/`:
- `npm run db:migrate` / `db:migrate:test`
- `npm run db:seed` / `db:seed:test` (and `:undo` variants)
- `npm run db:migration:create <name>` / `db:seed:create <name>`
- `npm run db:ui` / `db:ui:test`: open Supabase Studio (54323 dev / 54333 test)
- Local Supabase stacks live in `backend/db/dev/supabase` and `backend/db/test/supabase`. Start one with the Supabase CLI from that directory.
- Swagger UI is at `http://localhost:3000/docs` while the server runs.
- `npm test`: acceptance tests (Vitest) against the local testing Supabase stack. `npm run test:watch` runs them in watch mode. See `backend/tests/HELPERS.md`.

Run from `frontend/`:
- `npx playwright test`: e2e tests in `frontend/tests/`
- Single test: `npx playwright test tests/foo.spec.js -g "test name" --project=chromium`

## Environments

`NODE_ENV` is one of `development`, `testing`, `production`, and it selects:
- the `.env.<env>` file in `backend/` (loaded via `dotenv-flow`)
- the Sequelize config in `src/config/config.cjs`
- the seeder folder: `.sequelizerc` points `seeders-path` at `src/seeders/<env>/`, so seeders must be placed in the folder for the environment they target

Seeders that create auth users go through `src/seeders/supabaseAdmin.js` (service-role key).

Emails are sent with Resend (`src/emails/resend.js`). Outside production, set `EMAIL_REDIRECT_TO` in `backend/.env.<env>` to send every email to that one address instead of the real recipients. It is ignored when `NODE_ENV=production`.

## Backend architecture

**The OpenAPI spec drives routing.** `src/app.js` (`createApp`) builds the app and initializes `@oas-tools/core` using `.oastoolsrc`, with the spec at `api/oas-file.yaml` plus `api/paths/*.yaml` and `api/components/`. Each path declares `x-router-controller: <file>` and `operationId: <exportedFn>`, which map to `src/controllers/<file>.js`. Request **and response** validation is strict. When adding or changing an endpoint:
- Update the YAML.
- Make sure the response shape matches the schema, or the request fails.
- For public endpoints, set `security: [{}]` in the spec.

The layers are controllers → services → repositories → models:
- **Controllers** wrap handlers in `withController` (`controllerHandlers.js`). It opens a Sequelize transaction exposed as `req.transaction`, maps thrown errors with `.status` to HTTP responses, and supports `addAfterCommit` callbacks (e.g. emails, socket broadcasts).
- **Authorization** happens in controllers via `validateAuthenticated` / `validateStaff` (`middlewares/authMiddleware.js`). The current user is resolved from the JWT email to a `UserProfile`.
- **Services** contain business logic. They throw with `errorThrower(condition, message, status)` (`services/errorThrower.js`), use mappers in `services/mappers/`, and use reusable Sequelize includes in `services/includes/`.
- **Roles** are defined in `services/Roles.js`:
  - STAFF = Administrator/Designer/Facilitator
  - EVALUATOR
  - PARTICIPANT
  - SCIENTIST
  - PUBLIC

  Role tables live in `models/roles/`. Repositories pick a Sequelize scope per role (e.g. `HACKATHON_SCOPE_BY_ROLE` in `hackathonsRepository.js`) to control which fields and rows each role sees.
- **Models**: registered in `models/index.js`, with join tables in `models/intermediate/`. The schema changes only through migrations in `src/migrations/`; never alter tables by hand.
- **Hackathon lifecycle** uses the state pattern in `src/states/` (PLANNED → OPEN → CLOSED → FINISHED). Phase changes are broadcast over sockets (`sockets/hackathonPhases.js`).
- **Sockets** (`src/sockets/`): socket.io with JWT authorization, used for diagramming (conceptual maps) and group/team presentations.
- **Integrations**:
  - Emails: Resend with EJS templates in `src/emails/templates`
  - Files: Google Drive (`config/drive.js`, `services/driveService.js`)
  - `scripts/keep-supabase-alive.js`: run by a scheduled GitHub workflow

Style: ESLint `standard` (no semicolons, space before function parens), ES modules. No comments: code explains itself through names (helper functions, named constants). Put any non-obvious "why" in docs.

## Frontend architecture

- Pages are grouped by domain in `src/features/<domain>/` (auth, editions, hackathons, home, products, users), each with its own router component. Shared UI lives in `src/components/`.
- API calls go through the `useFetcher` hook (`src/utils/useFetcher.js`). It attaches the JWT from `token.service.js`, handles expired sessions by redirecting to `/signin`, and shows errors. Use it instead of raw `fetch`.
- Real-time features use `src/utils/useWebSockets.js`.
- Plain CSS files sit next to components.

## Docs

- `docs/project/`: production roadmap, decisions, product owner clarifications per use case, and the acceptance
  testing plan. Start at `docs/project/README.md`.
- `docs/diagrams/`: conceptual and domain diagrams (PlantUML sources and PNGs).
- The rest of `docs/` (thesis memoir sources) is local and not tracked.
