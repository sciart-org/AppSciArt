import { describe, it, expect } from 'vitest'
import {
  asGuest,
  withToken,
  participant,
  tokenOf,
  legacyTokenOf,
  forgedTokens,
  socketAs,
  nextEvent,
  shortLivedTokenOf,
  tokenOfUserWithoutProfile
} from '../support/index.js'

const SHORT_SESSION_SECONDS = 2

const WAIT_PAST_EXPIRY_MS = (SHORT_SESSION_SECONDS + 4) * 1000

const TEST_TIMEOUT_MS = WAIT_PAST_EXPIRY_MS + 10000

const detailOf = (error) =>
  ['string', 'number'].includes(typeof error?.description) ? ` (${error.description})` : ''

const connectionOutcome = (user, token) =>
  socketAs(user, { token }).then(
    () => 'accepted',
    (error) => `refused: ${error?.message ?? error}${detailOf(error)}`
  )

const afterConnecting = (user, token, observe) =>
  socketAs(user, { token }).then(
    observe,
    (error) => `connection refused before its session expired: ${error?.message ?? error}${detailOf(error)}`
  )

const INVALID_TOKENS = [
  ['an expired token', (user) => forgedTokens.expired(user)],
  ['a token signed with a wrong key', (user) => forgedTokens.wrongKey(user)],
  ['an unsigned token', (user) => forgedTokens.unsigned(user)],
  ['a garbage token', () => forgedTokens.garbage()],
  ['a token with no expiry', (user) => forgedTokens.noExpiry(user)],
  ['a token naming an unknown algorithm', (user) => forgedTokens.unknownAlgorithm(user)]
]

describe('FRQ-001 · a session from a real login', () => {
  it('FRQ-001 · a real login session gets its own profile', async () => {
    const token = await tokenOf(participant(1))

    const res = await withToken(token).get('/me')

    expect({ status: res.status }).toEqual({ status: 200 })
  })

  it('FRQ-001 · a real login session opens the real-time connection', async () => {
    const user = participant(1)
    const token = await tokenOf(user)

    const outcome = await connectionOutcome(user, token)

    expect(outcome).toBe('accepted')
  })
})

describe('FRQ-001 · a session signed with the legacy shared secret', () => {
  it('FRQ-001 · a legacy session gets its own profile', async () => {
    const token = await legacyTokenOf(participant(2))

    const res = await withToken(token).get('/me')

    expect({ status: res.status }).toEqual({ status: 200 })
  })

  it('FRQ-001 · a legacy session opens the real-time connection', async () => {
    const user = participant(2)
    const token = await legacyTokenOf(user)

    const outcome = await connectionOutcome(user, token)

    expect(outcome).toBe('accepted')
  })
})

describe('FRQ-001 · a token signed with a key the project does not publish', () => {
  it('FRQ-001 · a token signed with an unpublished key is rejected with 401', async () => {
    const token = await forgedTokens.unknownKey(participant(3))

    const res = await withToken(token).get('/me')

    expect({ status: res.status }).toEqual({ status: 401 })
  })

  it('FRQ-001 · a token signed with an unpublished key is refused on the real-time connection', async () => {
    const user = participant(3)
    const token = await forgedTokens.unknownKey(user)

    const outcome = await connectionOutcome(user, token)

    expect(outcome).toMatch(/^refused/)
  })
})

describe('FRQ-001 · invalid tokens', () => {
  it.each(INVALID_TOKENS)('FRQ-001 · %s is rejected with 401', async (_, tokenFor) => {
    const token = await tokenFor(participant(4))

    const res = await withToken(token).get('/me')

    expect({ status: res.status }).toEqual({ status: 401 })
  })

  it.each(INVALID_TOKENS)('FRQ-001 · %s is refused on the real-time connection', async (_, tokenFor) => {
    const user = participant(4)
    const token = await tokenFor(user)

    const outcome = await connectionOutcome(user, token)

    expect(outcome).toMatch(/^refused/)
  })
})

describe('FRQ-001 · no token', () => {
  it('FRQ-001 · a request with no token is rejected with 401', async () => {
    const res = await asGuest().get('/me')

    expect({ status: res.status }).toEqual({ status: 401 })
  })
})

describe('FRQ-001 · a valid session of an account with no user profile', () => {
  it('FRQ-001 · a session of an account without a user profile is refused on the real-time connection', async () => {
    const token = await tokenOfUserWithoutProfile()

    const outcome = await connectionOutcome(participant(5), token)

    expect(outcome).toMatch(/^refused/)
  })
})

describe('FRQ-001 · an empty session', () => {
  it('FRQ-001 · an empty session is refused on the real-time connection', async () => {
    const outcome = await connectionOutcome(participant(6), '')

    expect(outcome).toMatch(/^refused/)
  })
})

describe('FRQ-001 · a real-time connection that outlives its session', () => {
  it('FRQ-001 · the connection is told its session expired once it expires', async () => {
    const user = participant(7)
    const token = shortLivedTokenOf(user, SHORT_SESSION_SECONDS)

    const notice = await afterConnecting(user, token, (socket) =>
      nextEvent(socket, 'session_expired', WAIT_PAST_EXPIRY_MS).then(
        () => 'session_expired received',
        () => `no session_expired within ${WAIT_PAST_EXPIRY_MS} ms`
      )
    )

    expect(notice).toBe('session_expired received')
  }, TEST_TIMEOUT_MS)

  it('FRQ-001 · the server closes the connection after its session expires', async () => {
    const user = participant(8)
    const token = shortLivedTokenOf(user, SHORT_SESSION_SECONDS)

    const state = await afterConnecting(user, token, (socket) =>
      nextEvent(socket, 'disconnect', WAIT_PAST_EXPIRY_MS).then(
        () => 'closed',
        () => `still open ${WAIT_PAST_EXPIRY_MS} ms after connecting`
      )
    )

    expect(state).toBe('closed')
  }, TEST_TIMEOUT_MS)
})
