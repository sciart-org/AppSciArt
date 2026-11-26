import { randomUUID } from 'node:crypto'
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import {
  asGuest,
  designer,
  participant,
  productionApp,
  productionStartup,
  corsHeadersOf,
  forgedTokens,
  tokenOfUserWithoutProfile
} from '../support/index.js'

const FRONTEND_URL = 'https://sciart.example.org'

const LOCAL_DEV_ORIGIN = 'http://localhost:5173'

const UNKNOWN_ORIGIN = 'https://unknown.example'

const FIRST_EXTRA_ORIGIN = 'https://widgets.example.org'

const SECOND_EXTRA_ORIGIN = 'https://landing.example.org'

const EXTRA_ALLOWED_ORIGINS = `${FIRST_EXTRA_ORIGIN}, ${SECOND_EXTRA_ORIGIN}`

const FRONTEND_URL_WITH_SLASH = `${FRONTEND_URL}/`

const EXTRA_ORIGIN_WITH_PATH = `${FIRST_EXTRA_ORIGIN}/page/`

const FRONTEND_HOST_WITHOUT_SCHEME = 'sciart.example.org'

const EXTRA_HOST_WITHOUT_SCHEME = 'widgets.example.org'

const EXTRA_ORIGINS_WITH_ONE_WITHOUT_SCHEME = `${SECOND_EXTRA_ORIGIN}, ${EXTRA_HOST_WITHOUT_SCHEME}`

const SOCKET_HANDSHAKE_PATH = '/socket.io/?EIO=4&transport=polling'

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

const NEW_EDITION = { name: 'PROD-CONFIG edition', year: 2026 }

const escapeForPattern = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const errorPatternOf = (body) => new RegExp(escapeForPattern(body.error))

const errorMessageSummary = (body) => ({ errorMessageIsNonEmptyString: isNonEmptyString(body.error) })

const loggedEntryOf = async (app, logStart, body) => {
  const errorPattern = errorPatternOf(body)
  await expect.poll(() => entryNamingSummary(app.output().slice(logStart), errorPattern))
    .toEqual({ entryNaming: errorPattern.source, found: true })
  return entryNaming(app.output().slice(logStart), errorPattern)
}

const freshAddress = () => `prod-config.${randomUUID()}@example.org`

const quickRegister = (app, email) =>
  app.asGuest().post('/register').query({ method: 'quick' }).send({ email })

const SQL_QUERY_LOG = /^Executing \(/

const COMMIT_DETAILS = /COMMIT/

const commitDetailsSummary = (output, errorId) => {
  const nearbyLines = logAround(output, errorId).split('\n').filter((line) => !SQL_QUERY_LOG.test(line))
  return { errorId: output.includes(errorId) ? errorId : null, detailsNameCommit: nearbyLines.some((line) => COMMIT_DETAILS.test(line)) }
}

const HEADERS_SENT_ERROR = 'ERR_HTTP_HEADERS_SENT'

const headersSentLinesOf = (output) => output.split('\n').filter((line) => line.includes(HEADERS_SENT_ERROR))

const REFUSED_CONNECTION = 'Refused real-time connection'

const refusalEntryPattern = (reason) =>
  new RegExp(`^(?=.*${escapeForPattern(REFUSED_CONNECTION)})(?=.*\\b${escapeForPattern(reason)}\\b)`)

const NO_TOKEN_REFUSAL = refusalEntryPattern('no token')

const INVALID_TOKEN_REFUSAL = refusalEntryPattern('invalid token')

const NO_USER_PROFILE_REFUSAL = refusalEntryPattern('no user profile')

const NO_TOKEN = ''

const connectionAttemptOf = (app, token) =>
  app.socketAs(participant(1), { token }).then(() => 'connected', () => 'refused')

const loggedRefusalOf = async (app, logStart, refusalPattern) => {
  await expect.poll(() => entryNamingSummary(app.output().slice(logStart), refusalPattern))
    .toEqual({ entryNaming: refusalPattern.source, found: true })
  return entryNaming(app.output().slice(logStart), refusalPattern)
}

const linesContaining = (output, text) => output.split('\n').filter((line) => line.includes(text))

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

describe('PROD-CONFIG · a frontend URL written with a trailing slash', () => {
  let app

  beforeAll(async () => {
    app = await productionApp({ frontendUrl: FRONTEND_URL_WITH_SLASH })
  })

  afterAll(async () => {
    await app?.stop()
  })

  it('PROD-CONFIG · with a trailing slash in FRONTEND_URL a request from the frontend origin is allowed for exactly that origin', async () => {
    const res = await app.asGuest().get(PUBLIC_PATH).set('Origin', FRONTEND_URL)

    expect({ allowOrigin: corsHeadersOf(res).allowOrigin }).toEqual({ allowOrigin: FRONTEND_URL })
  })

  it('PROD-CONFIG · with a trailing slash in FRONTEND_URL a preflight from the frontend origin is allowed for exactly that origin', async () => {
    const res = await preflight(app.asGuest(), FRONTEND_URL)

    expect({ allowOrigin: corsHeadersOf(res).allowOrigin }).toEqual({ allowOrigin: FRONTEND_URL })
  })

  it('PROD-CONFIG · with a trailing slash in FRONTEND_URL the socket handshake from the frontend origin is allowed for exactly that origin', async () => {
    const res = await app.asGuest().get(SOCKET_HANDSHAKE_PATH).set('Origin', FRONTEND_URL)

    expect({ allowOrigin: corsHeadersOf(res).allowOrigin }).toEqual({ allowOrigin: FRONTEND_URL })
  })
})

describe('PROD-CONFIG · an extra origin written with a path and a trailing slash', () => {
  let app

  beforeAll(async () => {
    app = await productionApp({ frontendUrl: FRONTEND_URL, env: { EXTRA_ALLOWED_ORIGINS: EXTRA_ORIGIN_WITH_PATH } })
  })

  afterAll(async () => {
    await app?.stop()
  })

  it('PROD-CONFIG · with a path in an EXTRA_ALLOWED_ORIGINS entry a request from its origin is allowed for exactly that origin', async () => {
    const res = await app.asGuest().get(PUBLIC_PATH).set('Origin', FIRST_EXTRA_ORIGIN)

    expect({ allowOrigin: corsHeadersOf(res).allowOrigin }).toEqual({ allowOrigin: FIRST_EXTRA_ORIGIN })
  })

  it('PROD-CONFIG · with a path in an EXTRA_ALLOWED_ORIGINS entry a preflight from its origin is allowed for exactly that origin', async () => {
    const res = await preflight(app.asGuest(), FIRST_EXTRA_ORIGIN)

    expect({ allowOrigin: corsHeadersOf(res).allowOrigin }).toEqual({ allowOrigin: FIRST_EXTRA_ORIGIN })
  })
})

describe('PROD-CONFIG · production startup with a frontend URL without a scheme', () => {
  let startup

  beforeAll(async () => {
    startup = await productionStartup({ frontendUrl: FRONTEND_HOST_WITHOUT_SCHEME })
  })

  it('PROD-CONFIG · production with a FRONTEND_URL without a scheme does not start', () => {
    expect({ started: startup.started }).toEqual({ started: false })
  })

  it('PROD-CONFIG · production with a FRONTEND_URL without a scheme names FRONTEND_URL in its output', () => {
    const serverLinesNamingFrontendUrl = serverLinesOf(startup.output).filter((line) => line.includes('FRONTEND_URL'))

    expect({ serverLinesNamingFrontendUrl }).not.toEqual({ serverLinesNamingFrontendUrl: [] })
  })
})

describe('PROD-CONFIG · production startup with an extra origin without a scheme', () => {
  let startup

  beforeAll(async () => {
    startup = await productionStartup({
      frontendUrl: FRONTEND_URL,
      env: { EXTRA_ALLOWED_ORIGINS: EXTRA_ORIGINS_WITH_ONE_WITHOUT_SCHEME }
    })
  })

  it('PROD-CONFIG · production with an EXTRA_ALLOWED_ORIGINS entry without a scheme does not start', () => {
    expect({ started: startup.started }).toEqual({ started: false })
  })

  it('PROD-CONFIG · production with an EXTRA_ALLOWED_ORIGINS entry without a scheme names EXTRA_ALLOWED_ORIGINS in its output', () => {
    const serverLinesNamingExtraOrigins = serverLinesOf(startup.output).filter((line) => line.includes('EXTRA_ALLOWED_ORIGINS'))

    expect({ serverLinesNamingExtraOrigins }).not.toEqual({ serverLinesNamingExtraOrigins: [] })
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

describe('PROD-CONFIG · refused requests for items that do not exist in production', () => {
  let app

  beforeAll(async () => {
    app = await productionApp({ frontendUrl: FRONTEND_URL })
  })

  afterAll(async () => {
    await app?.stop()
  })

  it('PROD-CONFIG · a designer asking for a hackathon that does not exist is answered with a 404', async () => {
    const api = await app.as(designer(1))

    const res = await api.get(`/hackathons/${randomUUID()}`)

    expect(res.status).toBe(404)
  })

  it('PROD-CONFIG · a designer asking for a hackathon that does not exist is logged as an entry naming the error', async () => {
    const api = await app.as(designer(1))
    const logStart = app.output().length

    const res = await api.get(`/hackathons/${randomUUID()}`)

    expect(errorMessageSummary(res.body)).toEqual({ errorMessageIsNonEmptyString: true })
    await loggedEntryOf(app, logStart, res.body)
  })

  it('PROD-CONFIG · the log entry of a hackathon that does not exist has no stack trace', async () => {
    const api = await app.as(designer(1))
    const logStart = app.output().length

    const res = await api.get(`/hackathons/${randomUUID()}`)

    expect(errorMessageSummary(res.body)).toEqual({ errorMessageIsNonEmptyString: true })
    const entry = await loggedEntryOf(app, logStart, res.body)
    expect({ stackFrames: stackFramesOf(entry) }).toEqual({ stackFrames: [] })
  })
})

describe('PROD-CONFIG · refused requests when the Drive access has expired in production', () => {
  let app

  beforeAll(async () => {
    app = await productionApp({ frontendUrl: FRONTEND_URL, driveAccess: 'revoked' })
  })

  afterAll(async () => {
    await app?.stop()
  })

  it('PROD-CONFIG · a designer creating an edition while the Drive access has expired is answered with a 503', async () => {
    const api = await app.as(designer(1))

    const res = await api.post('/editions').send(NEW_EDITION)

    expect(res.status).toBe(503)
  })

  it('PROD-CONFIG · a designer creating an edition while the Drive access has expired is logged as an entry naming the error', async () => {
    const api = await app.as(designer(1))
    const logStart = app.output().length

    const res = await api.post('/editions').send(NEW_EDITION)

    expect(errorMessageSummary(res.body)).toEqual({ errorMessageIsNonEmptyString: true })
    await loggedEntryOf(app, logStart, res.body)
  })

  it('PROD-CONFIG · the log entry of an edition created while the Drive access has expired has no stack trace', async () => {
    const api = await app.as(designer(1))
    const logStart = app.output().length

    const res = await api.post('/editions').send(NEW_EDITION)

    expect(errorMessageSummary(res.body)).toEqual({ errorMessageIsNonEmptyString: true })
    const entry = await loggedEntryOf(app, logStart, res.body)
    expect({ stackFrames: stackFramesOf(entry) }).toEqual({ stackFrames: [] })
  })
})

describe('PROD-CONFIG · a change whose commit fails in production', () => {
  let app

  beforeAll(async () => {
    app = await productionApp({ frontendUrl: FRONTEND_URL })
  })

  afterAll(async () => {
    await app?.stop()
  })

  it('PROD-CONFIG · a quick registration whose commit fails is answered with a 500, not a 201', async () => {
    const email = freshAddress()
    app.failNextCommit()

    const res = await quickRegister(app, email)

    expect(res.status).toBe(500)
  })

  it('PROD-CONFIG · a quick registration whose commit fails has only the generic error and its error ID in its body', async () => {
    const email = freshAddress()
    app.failNextCommit()

    const res = await quickRegister(app, email)

    expect(fieldsOutsideAllowed(res.body)).toEqual([])
  })

  it('PROD-CONFIG · a quick registration whose commit fails has the fixed message and a non-empty error ID in its body', async () => {
    const email = freshAddress()
    app.failNextCommit()

    const res = await quickRegister(app, email)

    expect({ error: res.body.error, errorIdIsNonEmptyString: isNonEmptyString(res.body.errorId) })
      .toEqual({ error: GENERIC_ERROR_MESSAGE, errorIdIsNonEmptyString: true })
  })

  it('PROD-CONFIG · an address whose quick registration commit failed can be quick-registered again', async () => {
    const email = freshAddress()
    app.failNextCommit()
    await quickRegister(app, email)

    const res = await quickRegister(app, email)

    expect(res.status).toBe(201)
  })

  it('PROD-CONFIG · the error ID of a failed commit appears in the server log next to details naming COMMIT', async () => {
    const email = freshAddress()
    const logStart = app.output().length
    app.failNextCommit()

    const res = await quickRegister(app, email)
    const errorId = res.body.errorId

    expect({ errorIdIsNonEmptyString: isNonEmptyString(errorId) }).toEqual({ errorIdIsNonEmptyString: true })
    await expect.poll(() => commitDetailsSummary(app.output().slice(logStart), errorId))
      .toEqual({ errorId, detailsNameCommit: true })
  })

  it('PROD-CONFIG · the server log of a failed commit has no second error about a response already sent', async () => {
    const email = freshAddress()
    const logStart = app.output().length
    app.failNextCommit()

    const res = await quickRegister(app, email)
    const errorId = res.body.errorId

    expect({ errorIdIsNonEmptyString: isNonEmptyString(errorId) }).toEqual({ errorIdIsNonEmptyString: true })
    await expect.poll(() => commitDetailsSummary(app.output().slice(logStart), errorId))
      .toEqual({ errorId, detailsNameCommit: true })
    expect({ headersSentErrors: headersSentLinesOf(app.output().slice(logStart)) })
      .toEqual({ headersSentErrors: [] })
  })
})

describe('PROD-CONFIG · refused real-time connections in production', () => {
  let app

  beforeAll(async () => {
    app = await productionApp({ frontendUrl: FRONTEND_URL })
  })

  afterAll(async () => {
    await app?.stop()
  })

  it('PROD-CONFIG · a real-time connection with no token is refused', async () => {
    const connection = await connectionAttemptOf(app, NO_TOKEN)

    expect({ connection }).toEqual({ connection: 'refused' })
  })

  it('PROD-CONFIG · a real-time connection with no token is logged as an entry naming the reason no token', async () => {
    const logStart = app.output().length

    await connectionAttemptOf(app, NO_TOKEN)

    await loggedRefusalOf(app, logStart, NO_TOKEN_REFUSAL)
  })

  it('PROD-CONFIG · the log entry of a real-time connection with no token has no stack trace', async () => {
    const logStart = app.output().length

    await connectionAttemptOf(app, NO_TOKEN)

    const entry = await loggedRefusalOf(app, logStart, NO_TOKEN_REFUSAL)
    expect({ stackFrames: stackFramesOf(entry) }).toEqual({ stackFrames: [] })
  })

  it('PROD-CONFIG · a real-time connection with a token signed with a wrong key is refused', async () => {
    const token = forgedTokens.wrongKey(participant(1))

    const connection = await connectionAttemptOf(app, token)

    expect({ connection }).toEqual({ connection: 'refused' })
  })

  it('PROD-CONFIG · a real-time connection with a token signed with a wrong key is logged as an entry naming the reason invalid token', async () => {
    const token = forgedTokens.wrongKey(participant(1))
    const logStart = app.output().length

    await connectionAttemptOf(app, token)

    await loggedRefusalOf(app, logStart, INVALID_TOKEN_REFUSAL)
  })

  it('PROD-CONFIG · the log entry of a real-time connection with a token signed with a wrong key has no stack trace', async () => {
    const token = forgedTokens.wrongKey(participant(1))
    const logStart = app.output().length

    await connectionAttemptOf(app, token)

    const entry = await loggedRefusalOf(app, logStart, INVALID_TOKEN_REFUSAL)
    expect({ stackFrames: stackFramesOf(entry) }).toEqual({ stackFrames: [] })
  })

  it('PROD-CONFIG · a real-time connection of an account without a user profile is refused', async () => {
    const token = tokenOfUserWithoutProfile()

    const connection = await connectionAttemptOf(app, token)

    expect({ connection }).toEqual({ connection: 'refused' })
  })

  it('PROD-CONFIG · a real-time connection of an account without a user profile is logged as an entry naming the reason no user profile', async () => {
    const token = tokenOfUserWithoutProfile()
    const logStart = app.output().length

    await connectionAttemptOf(app, token)

    await loggedRefusalOf(app, logStart, NO_USER_PROFILE_REFUSAL)
  })

  it('PROD-CONFIG · the log entry of a real-time connection of an account without a user profile has no stack trace', async () => {
    const token = tokenOfUserWithoutProfile()
    const logStart = app.output().length

    await connectionAttemptOf(app, token)

    const entry = await loggedRefusalOf(app, logStart, NO_USER_PROFILE_REFUSAL)
    expect({ stackFrames: stackFramesOf(entry) }).toEqual({ stackFrames: [] })
  })

  it('PROD-CONFIG · the server log of a real-time connection refused for an invalid token has no copy of the token', async () => {
    const token = forgedTokens.wrongKey(participant(1))
    const logStart = app.output().length

    await connectionAttemptOf(app, token)

    await loggedRefusalOf(app, logStart, INVALID_TOKEN_REFUSAL)
    expect({ linesWithTheToken: linesContaining(app.output().slice(logStart), token) })
      .toEqual({ linesWithTheToken: [] })
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
