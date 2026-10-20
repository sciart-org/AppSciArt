import { createHmac } from 'crypto'
import { describe, expect, it } from 'vitest'
import {
  administrator, designer, facilitator, participant, participants, login, tokenOf, forgedTokens
} from '../support/index.js'

const decodePart = (part) => JSON.parse(Buffer.from(part, 'base64url').toString())

const decodeJwt = (token) => {
  const [header, payload, signature] = token.split('.')
  return { header: decodePart(header), claims: decodePart(payload), signature }
}

const isSignedWithAppSecret = (token) => {
  const [header, payload, signature] = token.split('.')
  const expected = createHmac('sha256', process.env.JWT_SECRET).update(`${header}.${payload}`).digest('base64url')
  return signature === expected
}

const nowInSeconds = () => Math.floor(Date.now() / 1000)

describe('base users', () => {
  it.each([
    { helper: 'administrator', baseUser: administrator, role: 'admin' },
    { helper: 'designer', baseUser: designer, role: 'designer' },
    { helper: 'facilitator', baseUser: facilitator, role: 'facilitator' },
    { helper: 'participant', baseUser: participant, role: 'participant' }
  ])('$helper(n) is the seeded user with that role and number', ({ baseUser, role }) => {
    const user = baseUser(7)

    expect(user.email).toBe(`${role}7@example.com`)
    expect(user.password).toBe(role)
    expect(user.id).toBeTruthy()
    expect(user.authId).toBeTruthy()
  })

  it('participants(count, from) lists consecutive participants', () => {
    const emails = participants(3, 4).map(user => user.email)

    expect(emails).toEqual(['participant4@example.com', 'participant5@example.com', 'participant6@example.com'])
  })

  it.each([0, 16, 1.5])('participant(%s) is rejected because base users are numbered 1 to 15', (number) => {
    expect(() => participant(number)).toThrow('Base users are numbered 1..15')
  })
})

describe('login and tokens', () => {
  it('login with the seeded password opens a session for that user', async () => {
    const user = facilitator(1)

    const { status, body } = await login(user)

    expect(status).toBe(200)
    expect(body.user.email).toBe(user.email)
  })

  it('login with a wrong password is refused by Supabase Auth', async () => {
    const { status } = await login({ ...facilitator(1), password: 'wrong-password' })

    expect(status).toBe(400)
  })

  it("tokenOf(user) is a token of that user's account", async () => {
    const user = participant(1)

    const { claims } = decodeJwt(await tokenOf(user))

    expect(claims.sub).toBe(user.authId)
    expect(claims.email).toBe(user.email)
  })
})

describe('forged tokens', () => {
  const user = () => participant(2)

  it('an expired token is correctly signed but its expiry is in the past', () => {
    const token = forgedTokens.expired(user())

    expect(isSignedWithAppSecret(token)).toBe(true)
    expect(decodeJwt(token).claims.exp).toBeLessThan(nowInSeconds())
  })

  it('a wrong-key token has valid claims for the user but is not signed with the app secret', () => {
    const token = forgedTokens.wrongKey(user())

    expect(decodeJwt(token).claims.sub).toBe(user().authId)
    expect(decodeJwt(token).claims.exp).toBeGreaterThan(nowInSeconds())
    expect(isSignedWithAppSecret(token)).toBe(false)
  })

  it('an unsigned token declares no algorithm and has an empty signature', () => {
    const { header, claims, signature } = decodeJwt(forgedTokens.unsigned(user()))

    expect(header.alg).toBe('none')
    expect(claims.sub).toBe(user().authId)
    expect(signature).toBe('')
  })

  it('a garbage token is not a JWT at all', () => {
    expect(forgedTokens.garbage().split('.')).toHaveLength(1)
  })
})
