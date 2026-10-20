# Acceptance test helpers

Acceptance tests check AppSciArt against its requirements (SRS) through the public API and sockets only.
Test files import everything from `tests/support/index.js` and nothing from `src/`.

```js
import { describe, it, expect } from 'vitest'
import { asGuest, as, facilitator, anAnnouncedEdition } from '../support/index.js'
```

Run them with `npm test` from `backend/`. Each test file starts from a clean state:
- the database holds only the base users,
- a fresh app is running,
- the fake Drive is empty,
- the email outbox is empty.

Tests inside one file share that state. Files run one at a time.

Prerequisites: the local testing Supabase stack running (`supabase start` in `db/test/supabase`), migrated
(`npm run db:migrate:test`) and seeded (`npm run db:seed:test`). The suite refuses to run against anything
that isn't local.

## Rules
- **Arrange** with the fixtures below, **act** and **assert** only through the API (`as`, `asGuest`, …) and sockets.
  Use `sentEmails()` and `drive.*` only to check what went to the email and Drive services.
- Name every test after the requirements it checks, e.g. `UC-041 · BRU-010 · announcing … is cancelled`.

## Actors (base users)
Plain functions (no `await`). Each returns `{ id, authId, email, password, name, surname }` (`id` is the user
profile id). They work inside tests and hooks, not at the top of a `describe` body, because the users are loaded
when the file starts.
There are 15 of each (`n` = 1–15); the same `n` is always the same person.

| Helper | Who |
|---|---|
| `administrator(n)` | Administrator |
| `designer(n)` | Designer |
| `facilitator(n)` | Facilitator |
| `participant(n)` | A registered user with no staff role |
| `participants(count, from = 1)` | `participant(from)` … `participant(from + count - 1)` |

A number outside 1–15 throws.

Inspiring scientists and evaluators aren't separate users. Give a participant that role with `aScientistOf` or
`anEvaluatorOf`.

## Calling the API
| Helper | Meaning |
|---|---|
| `asGuest()` | client with no token |
| `await as(user)` | client logged in as `user` (real login against the local Supabase Auth) |
| `withToken(token)` | client sending a raw bearer token |

A client has `get/post/put/patch/delete(path)`, which return a supertest request: chain `.send(body)`,
`.query({...})`, then `await` it for `{ status, body }`. Paths are the ones in `api/oas-file.yaml`,
e.g. `/editions`, `/hackathons/{id}`.

```js
const api = await as(designer(1))
const res = await api.post('/editions').send({ name: 'E1', year: 2026 })
```

### Login and tokens (FRQ-001)
- `await login({ email, password })` → `{ status, body }` straight from Supabase Auth. `body.access_token` is set on
  success.
- `await tokenOf(user)` → the user's access token (one real login per user and file, then cached).
- `forgedTokens.expired(user)`: a correctly signed token whose expiry is in the past.
- `forgedTokens.wrongKey(user)`: valid claims, signed with another key.
- `forgedTokens.unsigned(user)`: valid claims, `alg: none`, no signature.
- `forgedTokens.garbage()`: not a JWT.

## Sockets
- `await socketAs(user, { room, token })` → a connected socket.io client that sends the token the way the frontend
  does. `room` makes it emit `join_room` right away. `token` overrides the user's real token.
  - If the connection is refused, the promise rejects.
  - Sockets are closed after each test.
- `await nextEvent(socket, event, timeout = 2000)` → the payload of the next `event` (an array if there is more than
  one argument). Rejects on timeout.
- `await noEventArrives(socket, event, timeout = 500)` → `true` if `event` did **not** arrive in time.

## Fixtures (arrange only)
All async. Each one creates the state the system would be in after that step, and returns the created row (`id` and
its fields). Every option has a sensible default. Without options, a fixture creates an item with every required
attribute filled in.

### Editions
`anEdition({ state, name, year, shortDescription, longDescription, catalogLink })`. Shortcuts:

| Fixture | Edition state |
|---|---|
| `aNotAnnouncedEdition(o)` | not announced (`PLANNED`) |
| `anAnnouncedEdition(o)` | announced (`ACTIVE`) |
| `aClosedEdition(o)` | closed (`CLOSED`) |
| `aPublishedEdition(o)` | published (`PUBLISHED`), with a catalogue link |

To create an incomplete edition, pass `null` for a field, e.g. `aNotAnnouncedEdition({ longDescription: null })`.
Every edition gets its empty seed master template.

### Inspiring scientists and seeds
- `aScientistOf(edition, user)`: `user` is invited to `edition` as inspiring scientist. Returns `user`.
- `aSeed({ edition, authors, state, title, branchesOfKnowledge, videoLink, presentationLink, podcastLink })`
  - `authors`: users, each made a scientist of the edition too.
  - `state`: `IN_PROGRESS` (default, editable), `IN_REVIEW` (delivered) or `PUBLISHED`.
  - The seed gets its own template, copied from the edition's master.
  - If `edition` is omitted, a new announced edition is created.
- `aPublishedSeed(o)`: the same, with `state: 'PUBLISHED'`.

### Hackathons
`aHackathon({ edition, state, phase, type, internalName, description, sections, startDate, endDate, location,
meetLink, isPrivate, seeds, evaluators, participants, assisting })`

- `type`: `ON_SITE` (default), `ONLINE` or `HYBRID`.
- `location` is set unless the hackathon is online. `meetLink` is set unless it's on-site.
- `sections`: description sections `[{ sectionName, text }]`.
- Dates follow the state:

  | State | Start date |
  |---|---|
  | not announced, announced | 30 days ahead |
  | closed, ongoing | just started |
  | ended | 30 days ago |

- `seeds`: seeds assigned to the hackathon.
- `evaluators`: users made evaluators of this hackathon.
- `participants`: users enrolled, not marked as assisting.
- `assisting`: users enrolled and marked as assisting.
- If `edition` is omitted, a new announced edition is created.
- Every hackathon gets its empty flower master template.

Shortcuts:

| Fixture | Hackathon state |
|---|---|
| `aNotAnnouncedHackathon(o)` | not announced (`PLANNED`) |
| `anAnnouncedHackathon(o)` | announced, enrolment open (`OPEN`) |
| `aClosedHackathon(o)` | closed, not started (`CLOSED`, phase `PREPARING`) |
| `anOngoingHackathonAt(phase, o)` | started, in `phase` (see below) |
| `anEndedHackathon(o)` | ended (`FINISHED`) |

The phases, in order: `GROUP_CREATION`, `GROUP_WORK`, `GROUP_PRESENTATION`, `TEAM_CREATION`, `TEAM_WORK`,
`TEAM_PRESENTATION`.

- `aSeedOf(hackathon, seed)`: assign `seed` to `hackathon`.
- `anEvaluatorOf(hackathon, user)`: `user` becomes evaluator of `hackathon`.
- `enrol(user, hackathon, { roles = ['ARTIST'], interests, assisting = false })`: `user` is enrolled. `roles` are any
  of `ARTIST`, `TECHNOLOGIST`, `SCIENTIST`, `OTHER`. `interests` is the reason for joining.

### Groups and teams (ongoing hackathon)
Members must already be enrolled in the hackathon.

- `aGroup({ hackathon, seed, members, voice = members[0], map = null, delivered = false })`: an exploring group for
  `seed`, with its conceptual map. `map` is the map content (JSON). Returns the group.
- `aTeam({ hackathon, seed, members, speaker = members[0], number = 1, flowerState = 'IN_BLANK', title, concept })`: a
  co-creation team for `seed`, with its flower. The flower gets its own template, copied from the hackathon's master.
  Returns the flower. `flowerState` is `IN_BLANK`, `IN_PROGRESS`, `IN_REVIEW` (delivered) or `PUBLISHED`.

## Checking the email and Drive services
- `sentEmails()` → every email sent so far in this file: `[{ to: [address], subject, html, from }]`.
- `clearOutbox()` empties it, e.g. between tests.
- `drive.*` (async) finds the template documents the system creates. Each one returns the document `{ id, name,
  mimeType, parents, copiedFrom, permissions }`, or `undefined` if it doesn't exist. `copiedFrom` is the id of the
  document it was copied from.

  | Helper | Requirement | The document |
  |---|---|---|
  | `drive.seedMasterTemplateOf(edition)` | FRQ-020 | the edition's seed master template |
  | `drive.seedTemplateOf(seed)` | FRQ-022 | the seed's own template |
  | `drive.flowerMasterTemplateOf(hackathon)` | FRQ-021 | the hackathon's flower master template |
  | `drive.flowerTemplateOf(flower)` | UC-053 | the team's flower template |

- `driveFiles()` → every file in the fake Drive (last resort, for counts).

## How it works
- `npm test` runs Vitest with `NODE_ENV=testing`; `vitest.config.js` loads `tests/support/setup.js` first.
- Setup refuses to run unless `DATABASE_URL` and `SUPABASE_URL` point at `127.0.0.1` or `localhost`, then
  replaces the Google and Resend credentials with fake values.
- The app is started in-process with `createApp()` (`src/app.js`) on a free local port.
- `src/` is externalized in `vitest.config.js`: Node loads the app, not Vitest. oas-tools imports the controllers
  with Node's own `import()`, which Vitest can't intercept, so `vi.mock` would miss them. Externalizing everything
  keeps one copy of every app module.
- Because of that, the fakes are wired in at Node's module resolution: `tests/support/fakes/hooks.js` resolves
  `googleapis` and `resend` to `fakes/googleapis.js` and `fakes/resend.js`. The app and the tests share the fakes'
  state through `globalThis`. If the app didn't load both fakes, setup stops before any test runs.
- `tests/infra/` checks this tooling itself (users, tokens, fixtures, fakes, sockets, clean state). It tests no
  requirement.
