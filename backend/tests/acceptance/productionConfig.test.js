import { randomUUID } from 'node:crypto'
import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import {
  asGuest,
  participant,
  productionApp,
  productionStartup,
  corsHeadersOf
} from '../support/index.js'

const FRONTEND_URL = 'https://sciart.example.org'

const LOCAL_DEV_ORIGIN = 'http://localhost:5173'

const UNKNOWN_ORIGIN = 'https://unknown.example'

const FIRST_EXTRA_ORIGIN = 'https://widgets.example.org'

const SECOND_EXTRA_ORIGIN = 'https://landing.example.org'

const EXTRA_ALLOWED_ORIGINS = `${FIRST_EXTRA_ORIGIN}, ${SECOND_EXTRA_ORIGIN}`

const PUBLIC_PATH = '/editions'

const GENERIC_ERROR_MESSAGE = 'Internal Server Error'

const ALLOWED_ERROR_FIELDS = ['error', 'errorId']

const INTERNAL_ERROR_MARKERS = ['ECONNRESET', 'ECONNREFUSED', 'Connection terminated', 'Sequelize', 'stack', 'node_modules']

const ERROR_DETAILS = /ECONN|connect|connection|Sequelize|Error:/i

const LOG_WINDOW = 2000

const HELPER_START_LINE_PREFIX = 'productionApp:'

const serverLinesOf = (output) =>
  output.split('\n').filter((line) => line.trim() !== '' && !line.startsWith(HELPER_START_LINE_PREFIX))

const fieldsOutsideAllowed = (item, allowed = ALLOWED_ERROR_FIELDS) =>
  Object.keys(item).filter((key) => !allowed.includes(key))

const preflight = (client, origin) =>
  client.options(PUBLIC_PATH)
    .set('Origin', origin)
    .set('Access-Control-Request-Method', 'GET')

const internalMarkersIn = (text) => INTERNAL_ERROR_MARKERS.filter((marker) => text.includes(marker))

const genericErrorMarksOf = (body) => [
  Object.hasOwn(body, 'errorId') ? 'errorId' : null,
  JSON.stringify(body).includes(GENERIC_ERROR_MESSAGE) ? GENERIC_ERROR_MESSAGE : null
].filter(Boolean)

const isNonEmptyString = (value) => typeof value === 'string' && value.length > 0

const logAround = (output, errorId) => {
  const position = output.indexOf(errorId)
  if (position === -1) return ''
  return output.slice(Math.max(0, position - LOG_WINDOW), position + errorId.length + LOG_WINDOW)
    .replace(errorId, '')
}

const STACK_FRAME = /^\s+at /

const LINES_BEFORE_ENTRY = 2

const startsLogEntry = (line) => line.trim() !== '' && !/^\s/.test(line) && !line.startsWith('}')

const logEntriesOf = (output) => {
  const lines = output.split('\n')
  const entries = []
  lines.forEach((line, index) => {
    if (startsLogEntry(line) || entries.length === 0) {
      entries.push({ before: lines.slice(Math.max(0, index - LINES_BEFORE_ENTRY), index), lines: [line] })
      return
    }
    entries.at(-1).lines.push(line)
  })
  return entries
}

const stackTracesOf = (output) =>
  logEntriesOf(output)
    .filter((entry) => entry.lines.some((line) => STACK_FRAME.test(line)))
    .map((entry) => ({
      firstLine: entry.lines[0],
      nearby: [...entry.before, ...entry.lines].join('\n')
    }))

const stackTracesAwayFrom = (output, errorId) =>
  stackTracesOf(output)
    .filter((trace) => !trace.nearby.includes(errorId))
    .map((trace) => trace.firstLine)

const stackTracesNextTo = (output, errorId) =>
  stackTracesOf(output)
    .filter((trace) => trace.nearby.includes(errorId))
    .map((trace) => trace.firstLine)

const PROTECTED_PATH = '/me'

const INVALID_HACKATHON_PATH = '/hackathons/not-a-uuid'

const MISSING_TOKEN_ERROR = /SecurityError: Missing token/

const VALIDATION_ERROR = /RequestValidationError: Parameter hackathonId does not match the schema/

const LOG_RECORD_START = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}|^Executing \(/

const entryNaming = (output, errorPattern) => {
  const lines = output.split('\n')
  const start = lines.findIndex((line) => errorPattern.test(line))
  if (start === -1) return undefined
  const nextRecord = lines.findIndex((line, index) => index > start && LOG_RECORD_START.test(line))
  return lines.slice(start, nextRecord === -1 ? lines.length : nextRecord)
}

const entryNamingSummary = (output, errorPattern) =>
  ({ entryNaming: errorPattern.source, found: entryNaming(output, errorPattern) !== undefined })

const stackFramesOf = (entryLines = []) => entryLines.filter((line) => STACK_FRAME.test(line))

describe('PROD-CONFIG · browser origins in production', () => {
  let app

  beforeAll(async () => {
    app = await productionApp({ frontendUrl: FRONTEND_URL })
  })

  it('PROD-CONFIG · a request from the frontend origin is allowed for that origin', async () => {
    const res = await app.asGuest().get(PUBLIC_PATH).set('Origin', FRONTEND_URL)

    expect({ allowOrigin: corsHeadersOf(res).allowOrigin }).toEqual({ allowOrigin: FRONTEND_URL })
  })

  it('PROD-CONFIG · a preflight from the frontend origin is allowed for that origin', async () => {
    const res = await preflight(app.asGuest(), FRONTEND_URL)

    expect({ allowOrigin: corsHeadersOf(res).allowOrigin }).toEqual({ allowOrigin: FRONTEND_URL })
  })

  it('PROD-CONFIG · a request from the local development origin gets no CORS headers', async () => {
    const res = await app.asGuest().get(PUBLIC_PATH).set('Origin', LOCAL_DEV_ORIGIN)

    expect(corsHeadersOf(res)).toEqual({})
  })

  it('PROD-CONFIG · a request from the local development origin is not answered with a 500', async () => {
    const res = await app.asGuest().get(PUBLIC_PATH).set('Origin', LOCAL_DEV_ORIGIN)

    expect(res.status).not.toBe(500)
  })

  it('PROD-CONFIG · a request from an unknown origin gets no CORS headers', async () => {
    const res = await app.asGuest().get(PUBLIC_PATH).set('Origin', UNKNOWN_ORIGIN)

    expect(corsHeadersOf(res)).toEqual({})
  })

  it('PROD-CONFIG · a request from an unknown origin is not answered with a 500', async () => {
    const res = await app.asGuest().get(PUBLIC_PATH).set('Origin', UNKNOWN_ORIGIN)

    expect(res.status).not.toBe(500)
  })

  it('PROD-CONFIG · a preflight from an unknown origin gets no CORS headers', async () => {
    const res = await preflight(app.asGuest(), UNKNOWN_ORIGIN)

    expect(corsHeadersOf(res)).toEqual({})
  })

  it('PROD-CONFIG · a preflight from an unknown origin is not answered with a 500', async () => {
    const res = await preflight(app.asGuest(), UNKNOWN_ORIGIN)

    expect(res.status).not.toBe(500)
  })
})

describe('PROD-CONFIG · extra browser origins in production', () => {
  let app

  beforeAll(async () => {
    app = await productionApp({ frontendUrl: FRONTEND_URL, env: { EXTRA_ALLOWED_ORIGINS } })
  })

  it('PROD-CONFIG · a request from an origin in EXTRA_ALLOWED_ORIGINS is allowed for that origin', async () => {
    const res = await app.asGuest().get(PUBLIC_PATH).set('Origin', SECOND_EXTRA_ORIGIN)

    expect({ allowOrigin: corsHeadersOf(res).allowOrigin }).toEqual({ allowOrigin: SECOND_EXTRA_ORIGIN })
  })

  it('PROD-CONFIG · a preflight from an origin in EXTRA_ALLOWED_ORIGINS is allowed for that origin', async () => {
    const res = await preflight(app.asGuest(), SECOND_EXTRA_ORIGIN)

    expect({ allowOrigin: corsHeadersOf(res).allowOrigin }).toEqual({ allowOrigin: SECOND_EXTRA_ORIGIN })
  })
})

describe('PROD-CONFIG · unexpected errors in production', () => {
  let app

  beforeAll(async () => {
    app = await productionApp({ frontendUrl: FRONTEND_URL })
  })

  afterEach(() => {
    app.restoreDatabase()
  })

  it('PROD-CONFIG · an unexpected error is answered with a 500', async () => {
    app.cutDatabase()

    const res = await app.asGuest().get(PUBLIC_PATH)

    expect(res.status).toBe(500)
  })

  it('PROD-CONFIG · an unexpected error body has only the generic error and its error ID', async () => {
    app.cutDatabase()

    const res = await app.asGuest().get(PUBLIC_PATH)

    expect(fieldsOutsideAllowed(res.body)).toEqual([])
  })

  it('PROD-CONFIG · an unexpected error body has the fixed message and a non-empty error ID', async () => {
    app.cutDatabase()

    const res = await app.asGuest().get(PUBLIC_PATH)

    expect({ error: res.body.error, errorIdIsNonEmptyString: isNonEmptyString(res.body.errorId) })
      .toEqual({ error: GENERIC_ERROR_MESSAGE, errorIdIsNonEmptyString: true })
  })

  it('PROD-CONFIG · an unexpected error response names no internal error', async () => {
    app.cutDatabase()

    const res = await app.asGuest().get(PUBLIC_PATH)

    expect(internalMarkersIn(res.text)).toEqual([])
  })

  it('PROD-CONFIG · the error ID of an unexpected error appears in the server log', async () => {
    app.cutDatabase()
    const res = await app.asGuest().get(PUBLIC_PATH)
    const errorId = res.body.errorId

    app.restoreDatabase()

    expect({ errorIdIsNonEmptyString: isNonEmptyString(errorId) }).toEqual({ errorIdIsNonEmptyString: true })
    await expect.poll(() => app.output()).toContain(errorId)
  })

  it('PROD-CONFIG · the server log shows the error details next to its error ID', async () => {
    app.cutDatabase()
    const res = await app.asGuest().get(PUBLIC_PATH)
    const errorId = res.body.errorId

    app.restoreDatabase()

    expect({ errorIdIsNonEmptyString: isNonEmptyString(errorId) }).toEqual({ errorIdIsNonEmptyString: true })
    await expect.poll(() => logAround(app.output(), errorId)).toMatch(ERROR_DETAILS)
  })

  it('PROD-CONFIG · the stack trace of an unexpected error appears in the server log next to its error ID', async () => {
    const logStart = app.output().length
    app.cutDatabase()
    const res = await app.asGuest().get(PUBLIC_PATH)
    const errorId = res.body.errorId

    app.restoreDatabase()

    expect({ errorIdIsNonEmptyString: isNonEmptyString(errorId) }).toEqual({ errorIdIsNonEmptyString: true })
    await expect.poll(() => ({ stackTracesNextToErrorId: stackTracesNextTo(app.output().slice(logStart), errorId) }))
      .not.toEqual({ stackTracesNextToErrorId: [] })
  })

  it('PROD-CONFIG · the server log has no copy of an unexpected error stack trace away from its error ID', async () => {
    const logStart = app.output().length
    app.cutDatabase()
    const res = await app.asGuest().get(PUBLIC_PATH)
    const errorId = res.body.errorId

    app.restoreDatabase()
    await expect.poll(() => stackTracesNextTo(app.output().slice(logStart), errorId).length).toBeGreaterThan(0)
    const newOutput = app.output().slice(logStart)

    expect({ stackTracesAwayFromErrorId: stackTracesAwayFrom(newOutput, errorId) })
      .toEqual({ stackTracesAwayFromErrorId: [] })
  })

  it('PROD-CONFIG · two unexpected errors get different error IDs', async () => {
    app.cutDatabase()

    const first = await app.asGuest().get(PUBLIC_PATH)
    const second = await app.asGuest().get(PUBLIC_PATH)

    const errorIds = [first.body.errorId, second.body.errorId]
    expect(errorIds.filter(isNonEmptyString)).toEqual(errorIds)
    expect(second.body.errorId).not.toBe(first.body.errorId)
  })

  it('PROD-CONFIG · a hackathon that does not exist is answered with a 404', async () => {
    const api = await app.as(participant(1))

    const res = await api.get(`/hackathons/${randomUUID()}`)

    expect(res.status).toBe(404)
  })

  it('PROD-CONFIG · a hackathon that does not exist is not turned into the generic error', async () => {
    const api = await app.as(participant(1))

    const res = await api.get(`/hackathons/${randomUUID()}`)

    expect(genericErrorMarksOf(res.body)).toEqual([])
  })
})

describe('PROD-CONFIG · refused requests in production', () => {
  let app

  beforeAll(async () => {
    app = await productionApp({ frontendUrl: FRONTEND_URL })
  })

  it('PROD-CONFIG · a request without a token to an endpoint that needs one is answered with a 401', async () => {
    const res = await app.asGuest().get(PROTECTED_PATH)

    expect(res.status).toBe(401)
  })

  it('PROD-CONFIG · a request without a token to an endpoint that needs one is logged as an entry naming the error', async () => {
    const logStart = app.output().length

    await app.asGuest().get(PROTECTED_PATH)

    await expect.poll(() => entryNamingSummary(app.output().slice(logStart), MISSING_TOKEN_ERROR))
      .toEqual({ entryNaming: MISSING_TOKEN_ERROR.source, found: true })
  })

  it('PROD-CONFIG · the log entry of a request without a token has no stack trace', async () => {
    const logStart = app.output().length

    await app.asGuest().get(PROTECTED_PATH)
    await expect.poll(() => entryNamingSummary(app.output().slice(logStart), MISSING_TOKEN_ERROR))
      .toEqual({ entryNaming: MISSING_TOKEN_ERROR.source, found: true })

    expect({ stackFrames: stackFramesOf(entryNaming(app.output().slice(logStart), MISSING_TOKEN_ERROR)) })
      .toEqual({ stackFrames: [] })
  })

  it('PROD-CONFIG · an invalid request is answered with a 400', async () => {
    const api = await app.as(participant(1))

    const res = await api.get(INVALID_HACKATHON_PATH)

    expect(res.status).toBe(400)
  })

  it('PROD-CONFIG · an invalid request is logged as an entry naming the error', async () => {
    const api = await app.as(participant(1))
    const logStart = app.output().length

    await api.get(INVALID_HACKATHON_PATH)

    await expect.poll(() => entryNamingSummary(app.output().slice(logStart), VALIDATION_ERROR))
      .toEqual({ entryNaming: VALIDATION_ERROR.source, found: true })
  })

  it('PROD-CONFIG · the log entry of an invalid request has no stack trace', async () => {
    const api = await app.as(participant(1))
    const logStart = app.output().length

    await api.get(INVALID_HACKATHON_PATH)
    await expect.poll(() => entryNamingSummary(app.output().slice(logStart), VALIDATION_ERROR))
      .toEqual({ entryNaming: VALIDATION_ERROR.source, found: true })

    expect({ stackFrames: stackFramesOf(entryNaming(app.output().slice(logStart), VALIDATION_ERROR)) })
      .toEqual({ stackFrames: [] })
  })
})

describe('PROD-CONFIG · production startup without a frontend URL', () => {
  let startup

  beforeAll(async () => {
    startup = await productionStartup({ frontendUrl: null })
  })

  it('PROD-CONFIG · production without FRONTEND_URL does not start', () => {
    expect({ started: startup.started }).toEqual({ started: false })
  })

  it('PROD-CONFIG · production without FRONTEND_URL names FRONTEND_URL in its output', () => {
    const serverLinesNamingFrontendUrl = serverLinesOf(startup.output).filter((line) => line.includes('FRONTEND_URL'))

    expect({ serverLinesNamingFrontendUrl }).not.toEqual({ serverLinesNamingFrontendUrl: [] })
  })
})

describe('PROD-CONFIG · local development outside production', () => {
  it('PROD-CONFIG · the testing app still accepts the local development origin', async () => {
    const res = await asGuest().get(PUBLIC_PATH).set('Origin', LOCAL_DEV_ORIGIN)

    expect([LOCAL_DEV_ORIGIN, '*']).toContain(corsHeadersOf(res).allowOrigin)
  })
})

describe('PROD-CONFIG · API documentation in production', () => {
  let app

  beforeAll(async () => {
    app = await productionApp({ frontendUrl: FRONTEND_URL })
  })

  it('PROD-CONFIG · a production instance serves the API documentation at /docs', async () => {
    const res = await app.asGuest().get('/docs').redirects(2)

    expect(res.status).toBe(200)
  })
})
