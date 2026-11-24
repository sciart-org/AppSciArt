import cors from 'cors'

const LOCAL_ORIGINS = ['http://localhost:3000', 'http://localhost:5173']
const WEB_PROTOCOLS = ['http:', 'https:']

const isProduction = () => process.env.NODE_ENV === 'production'

const toOrigin = (value, variableName) => {
  const url = URL.parse(value)
  if (!url || !WEB_PROTOCOLS.includes(url.protocol)) {
    throw new Error(`${variableName} must be an http(s) URL, got '${value}'`)
  }
  return url.origin
}

const parseOriginList = (variableName) =>
  (process.env[variableName] || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
    .map(origin => toOrigin(origin, variableName))

export const frontendOrigin = () => {
  const frontendUrl = process.env.FRONTEND_URL
  return frontendUrl ? toOrigin(frontendUrl, 'FRONTEND_URL') : undefined
}

const productionOrigins = () => {
  const origin = frontendOrigin()
  if (!origin) throw new Error('FRONTEND_URL must be set in production')
  return [origin, ...parseOriginList('EXTRA_ALLOWED_ORIGINS')]
}

const developmentOrigins = () => [
  ...LOCAL_ORIGINS,
  frontendOrigin() || 'http://localhost:5173',
  process.env.BACKEND_URL ? toOrigin(process.env.BACKEND_URL, 'BACKEND_URL') : 'http://localhost:3000',
  ...parseOriginList('EXTRA_ALLOWED_ORIGINS')
]

export function corsMiddleware () {
  const ACCEPTED_ORIGINS = isProduction() ? productionOrigins() : developmentOrigins()

  return cors({
    origin: (origin, callback) => callback(null, !origin || ACCEPTED_ORIGINS.includes(origin))
  })
}
