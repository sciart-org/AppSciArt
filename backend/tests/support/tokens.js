import { createHmac } from 'crypto'

const ONE_HOUR_IN_SECONDS = 3600
const tokensByEmail = new Map()

export const login = async ({ email, password }) => {
  const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: process.env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return { status: response.status, body: await response.json() }
}

export const tokenOf = async (user) => {
  if (!tokensByEmail.has(user.email)) {
    const { status, body } = await login(user)
    if (status !== 200) throw new Error(`Login failed for ${user.email}: ${status} ${JSON.stringify(body)}`)
    tokensByEmail.set(user.email, body.access_token)
  }
  return tokensByEmail.get(user.email)
}

const base64UrlJson = (value) => Buffer.from(JSON.stringify(value)).toString('base64url')

const nowInSeconds = () => Math.floor(Date.now() / 1000)

const claimsOf = (user, { issuedAt = nowInSeconds() } = {}) => ({
  sub: user.authId,
  email: user.email,
  role: 'authenticated',
  aud: 'authenticated',
  iss: process.env.JWT_ISSUER,
  iat: issuedAt,
  exp: issuedAt + ONE_HOUR_IN_SECONDS
})

const signedWith = (secret, claims) => {
  const header = base64UrlJson({ alg: 'HS256', typ: 'JWT' })
  const payload = base64UrlJson(claims)
  const signature = createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url')
  return `${header}.${payload}.${signature}`
}

const unsigned = (claims) => `${base64UrlJson({ alg: 'none', typ: 'JWT' })}.${base64UrlJson(claims)}.`

export const forgedTokens = {
  expired: (user) => signedWith(process.env.JWT_SECRET, claimsOf(user, { issuedAt: nowInSeconds() - 2 * ONE_HOUR_IN_SECONDS })),
  wrongKey: (user) => signedWith('not-the-real-secret-not-the-real-secret', claimsOf(user)),
  unsigned: (user) => unsigned(claimsOf(user)),
  garbage: () => 'not-a-jwt'
}
