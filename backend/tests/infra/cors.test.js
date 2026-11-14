import { describe, expect, it } from 'vitest'
import { asGuest, corsHeadersOf } from '../support/index.js'

describe('corsHeadersOf', () => {
  it('returns every Access-Control-* header of a response, named in camelCase', () => {
    const response = {
      headers: {
        'access-control-allow-origin': 'https://frontend.example.org',
        'access-control-allow-methods': 'GET,POST',
        vary: 'Origin',
        'content-type': 'application/json'
      }
    }

    expect(corsHeadersOf(response)).toEqual({
      allowOrigin: 'https://frontend.example.org',
      allowMethods: 'GET,POST'
    })
  })

  it('returns an empty object when the response has no CORS header', () => {
    expect(corsHeadersOf({ headers: { vary: 'Origin' } })).toEqual({})
  })
})

describe('sending an Origin header', () => {
  it('a client sends a preflight with options(path) and the Origin set on the request', async () => {
    const origin = process.env.FRONTEND_URL

    const preflight = await asGuest().options('/editions')
      .set('Origin', origin)
      .set('Access-Control-Request-Method', 'POST')

    expect(corsHeadersOf(preflight).allowOrigin).toBe(origin)
  })
})
