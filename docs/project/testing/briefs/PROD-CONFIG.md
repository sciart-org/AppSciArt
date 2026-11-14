# PROD-CONFIG Production settings → `backend/tests/acceptance/productionConfig.test.js`

> Not an SRS requirement: how the server behaves when it runs as production (`NODE_ENV=production`), which is how
> both deployed servers run. Every case runs against a production instance (`productionApp()`, `HELPERS.md`
> "Production instance"), except B11.

## Requirement
- No SRS requirement covers production settings. The expected behaviour comes from the user's decisions
  (D-064, private until released; 2026-11-14):
  - Browsers may call the API only from the frontend (`FRONTEND_URL`). The server refuses to start without it.
  - An unexpected error (`500`) returns a fixed message and an error ID; the details go only to the server log,
    under the same ID. Storing errors with their ID is left for later.
  - The API documentation (`/docs`) stays available in every environment.
- Background: OWASP API Security Top 10 2023, API8 (CORS policy, error messages) and the OWASP Error Handling Cheat
  Sheet (generic response, details logged server side).

## Clarifications
- `docs/project/clarifications/general.md`: "HTTP meaning".

## Vocabulary
- Production instance = `productionApp({ frontendUrl })`; its `output()` is the server log.
- Startup check = `productionStartup({ frontendUrl: null })`; use `started` and `output`, not `exitCode`.
- Unexpected error = a request that needs the database while it is cut (`cutDatabase()`), e.g. `GET /editions`.
- CORS headers = `corsHeadersOf(res)`; "no CORS headers" = `{}`. Send the origin with `.set('Origin', …)`.
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

Unexpected errors
- **B6** An unexpected error → `500` with exactly the error body above; the body names no internal error (e.g. no
  `ECONNRESET`).
- **B7** The `errorId` of B6 appears in the server log, next to the error's details.
- **B8** Two unexpected errors get different `errorId`s.
- **B9** An expected error is not turned into the generic one: a hackathon that doesn't exist → `404`, and its
  body is not the error body above (no `errorId`, no `"Internal Server Error"`).

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
