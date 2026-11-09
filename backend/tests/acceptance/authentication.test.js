import { describe, it, expect } from 'vitest'
import {
  asGuest,
  withToken,
  participant,
  tokenOf,
  legacyTokenOf,
  forgedTokens,
  socketAs
} from '../support/index.js'

const connectionOutcome = (user, token) =>
  socketAs(user, { token }).then(
    () => 'accepted',
    (error) => `refused: ${error?.message ?? error}`
  )

const INVALID_TOKENS = [
  ['an expired token', (user) => forgedTokens.expired(user)],
  ['a token signed with a wrong key', (user) => forgedTokens.wrongKey(user)],
  ['an unsigned token', (user) => forgedTokens.unsigned(user)],
  ['a garbage token', () => forgedTokens.garbage()]
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
