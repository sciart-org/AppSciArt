# PROD-CONFIG Production settings → `backend/tests/acceptance/productionConfig.test.js`

> Not an SRS requirement: how the server behaves when it runs as production (`NODE_ENV=production`), which is how
> both deployed servers run. Every case runs against a production instance (`productionApp()`, `HELPERS.md`
> "Production instance"), except B11.

## Requirement
- No SRS requirement covers production settings. The expected behaviour comes from the user's decisions
  (D-064, D-066, D-067 and D-070, private until released; 2026-11-14 to 2026-11-24):
  - Browsers may call the API only from the frontend (`FRONTEND_URL`) and from the origins listed in
    `EXTRA_ALLOWED_ORIGINS` (comma-separated, e.g. a website that embeds the widgets). The server refuses to start
    without `FRONTEND_URL`.
  - An unexpected error (`500`) returns a fixed message and an error ID; the details go only to the server log,
    under the same ID. Storing errors with their ID is left for later.
  - A request the server refuses on purpose (`400`, `401`) is logged as one entry naming the error, with no stack
    trace. This holds for every refusal, whichever part of the server makes it (e.g. a `404` for an item that
    doesn't exist), and for the `503` when the server's Drive access has expired (2026-11-24).
  - The API documentation (`/docs`) stays available in every environment.
  - Each configured origin is reduced to its origin (scheme, host, port) the way a browser builds the `Origin`
    header; a value that is not an `http`/`https` URL stops the server at startup, naming the variable (#313,
    2026-11-23). Sockets use the same frontend origin.
- A change is reported as saved only once it is stored: if storing it fails at the last moment (the commit), the
  request answers as an unexpected error, with no success response, and the log shows that failure without a second
  error hiding it (D-072, #310, 2026-11-24).
- Background: OWASP API Security Top 10 2023, API8 (CORS policy, error messages) and the OWASP Error Handling Cheat
  Sheet (generic response, details logged server side).

## Clarifications
- `docs/project/clarifications/general.md`: "HTTP meaning".

## Vocabulary
- Production instance = `productionApp({ frontendUrl })`; its `output()` is the server log.
- Startup check = `productionStartup({ frontendUrl: null })`; use `started` and `output`, not `exitCode`.
- Unexpected error = a request that needs the database while it is cut (`cutDatabase()`), e.g. `GET /editions`.
- CORS headers = `corsHeadersOf(res)`; "no CORS headers" = `{}`. Send the origin with `.set('Origin', …)`.
- Stack trace = the `    at …` frame lines that follow an error's name in the server log.
- A commit that fails = `failNextCommit()` on the production instance, armed right before the request under test
  (`HELPERS.md`, "Production instance").
- Quick registration = `POST /register?method=quick` with `{ email }`, as a guest.
- Error body for an unexpected error = exactly `{ "error": "Internal Server Error", "errorId": "<id>" }`, `errorId`
  a non-empty string.

## Test cases
Browser origins
- **B1** A request from the frontend origin (`FRONTEND_URL`) → `Access-Control-Allow-Origin` is that origin.
- **B2** A preflight (`OPTIONS`) from the frontend origin → allowed for that origin.
- **B3** A request from `http://localhost:5173` → no CORS headers, and not a `500` (the request itself is answered
  as usual).
- **B4** A request from an unknown origin (e.g. `https://unknown.example`) → no CORS headers, and not a `500`.
- **B5** A preflight from an unknown origin → no CORS headers, and not a `500`.
- **B13** With two origins in `EXTRA_ALLOWED_ORIGINS` (`env`, comma-separated with a space after the comma), a
  request and a preflight from the second one → allowed for that origin.

Configured origins as written by hand
- A browser's `Origin` is only `scheme://host[:port]`: no trailing slash, no path. A configured value is reduced to
  that origin before it is compared.
- **B16** `FRONTEND_URL` ends in a slash (`https://sciart.example.org/`) → a request and a preflight from
  `https://sciart.example.org` are allowed, and `Access-Control-Allow-Origin` is exactly that origin, with no
  slash.
- **B17** An `EXTRA_ALLOWED_ORIGINS` entry has a path and a trailing slash (`https://widgets.example.org/page/`) →
  a request and a preflight from `https://widgets.example.org` are allowed for exactly that origin.
- **B18** A value without a scheme → the server does not start, and its own output names the variable. Once for
  `FRONTEND_URL` (`sciart.example.org`) and once for an `EXTRA_ALLOWED_ORIGINS` entry (`widgets.example.org`,
  next to a valid one). Leave out the helper's start line, as in B10.
- **B19** Sockets: with `FRONTEND_URL` ending in a slash, the socket.io handshake
  (`GET /socket.io/?EIO=4&transport=polling`) from `https://sciart.example.org` → `Access-Control-Allow-Origin` is
  exactly `https://sciart.example.org`.

Unexpected errors
- **B6** An unexpected error → `500` with exactly the error body above; the body names no internal error (e.g. no
  `ECONNRESET`).
- **B7** The `errorId` of B6 appears in the server log, next to the error's details.
- **B8** Two unexpected errors get different `errorId`s.
- **B14** The stack trace of an unexpected error appears in the server log only next to its `errorId`: the log
  has no other copy of it.
- **B9** An expected error is not turned into the generic one: a hackathon that doesn't exist → `404`, and its
  body is not the error body above (no `errorId`, no `"Internal Server Error"`).

Refused requests
- **B15** A refused request is logged as one entry naming the error, with no stack trace: a request without a token
  to an endpoint that needs one (`401`), and an invalid request (`400`). The error's entry and its stack trace, if
  any, are written to the log together, so wait for the entry naming the error, then check it; never wait a fixed
  time.
- **B20** A logged-in designer asks for the details of a hackathon that doesn't exist (`GET /hackathons/<random
  uuid>`) → `404`; the log has one entry naming the error, with no stack trace. Wait for the entry as in B15.
- **B21** On a production instance whose Drive access has expired (`productionApp({ driveAccess: 'revoked' })`), a
  designer creates an edition → `503`; the log has one entry naming the error, with no stack trace. Wait for the
  entry as in B15.

A commit that fails
- Each case: a guest quick-registers a fresh address while the instance's next commit fails.
- **B22** → `500` with exactly the error body above, not `201`.
- **B23** Afterwards, the same address is quick-registered again → `201`: the first one was not stored.
- **B24** The `errorId` of B22 appears in the server log next to the failed commit's details, which name `COMMIT`.
- **B25** Once B24's entry is in the log, the log has no `ERR_HTTP_HEADERS_SENT` (no second error about a response
  already sent).

Startup and documentation
- **B10** Production without `FRONTEND_URL` → the server does not start, and the server's own output names
  `FRONTEND_URL`. Leave out the start line the helper itself prints (`HELPERS.md`, "Production instance"), which
  names `FRONTEND_URL` in every run.
- **B11** The testing app (not production) still accepts `http://localhost:5173`, so local development keeps
  working.
- **B12** A production instance serves the API documentation at `/docs`.

## Fixture notes
- Start one production instance per `describe` in `beforeAll`, and restore its database after each test that cuts
  it.
- Use any public endpoint for the origin checks (e.g. `GET /editions`).
- B22–B25 share one production instance in their own `describe`; each test uses its own address. Wait for B24's
  entry as in B15, never for a fixed time.
- B21 needs its own production instance (its own `describe`), started with `driveAccess: 'revoked'`.
