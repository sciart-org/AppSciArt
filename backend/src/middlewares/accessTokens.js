import { createRemoteJWKSet, decodeProtectedHeader, errors as joseErrors, jwtVerify } from 'jose'
import { errors as oasErrors } from '@oas-tools/commons'

const { SecurityError } = oasErrors
const BEARER_PREFIX = /^Bearer\s+/
const KEY_SERVER_FAILURES = ['ERR_JWKS_TIMEOUT', 'ERR_JWKS_INVALID']

const publishedKeysUrl = (supabaseUrl) => new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`)

const bearerTokenOf = (authorizationHeader) => {
  if (!BEARER_PREFIX.test(authorizationHeader ?? '')) throw new SecurityError('Invalid token provided')
  return authorizationHeader.replace(BEARER_PREFIX, '')
}

const algorithmOf = (token) => {
  try {
    return decodeProtectedHeader(token).alg
  } catch {
    throw new SecurityError('Invalid token: unreadable header')
  }
}

const isProblemWithTheToken = (error) =>
  error instanceof joseErrors.JOSEError && !KEY_SERVER_FAILURES.includes(error.code)

export const createAccessTokenVerifier = ({ supabaseUrl, secret, issuer }) => {
  const publishedKeys = createRemoteJWKSet(publishedKeysUrl(supabaseUrl))
  const keyByAlgorithm = {
    HS256: new TextEncoder().encode(secret),
    ES256: publishedKeys,
    RS256: publishedKeys
  }

  return async (authorizationHeader) => {
    const token = bearerTokenOf(authorizationHeader)
    const alg = algorithmOf(token)
    const key = keyByAlgorithm[alg]
    if (!key) throw new SecurityError(`Unsupported token algorithm: ${alg}`)
    try {
      const { payload } = await jwtVerify(token, key, { issuer, algorithms: [alg] })
      return payload
    } catch (error) {
      if (isProblemWithTheToken(error)) throw new SecurityError(`Invalid token: ${error.code}`)
      throw error
    }
  }
}

export const accessTokenVerifierFromEnv = () => createAccessTokenVerifier({
  supabaseUrl: process.env.SUPABASE_URL,
  secret: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER
})
