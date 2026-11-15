import cors from 'cors'

const LOCAL_ORIGINS = ['http://localhost:3000', 'http://localhost:5173']

const isProduction = () => process.env.NODE_ENV === 'production'

const parseOriginList = (value = '') =>
  value.split(',').map(origin => origin.trim()).filter(Boolean)

const productionOrigins = () => {
  const frontendUrl = process.env.FRONTEND_URL
  if (!frontendUrl) throw new Error('FRONTEND_URL must be set in production')
  return [frontendUrl, ...parseOriginList(process.env.EXTRA_ALLOWED_ORIGINS)]
}

const developmentOrigins = () => [
  ...LOCAL_ORIGINS,
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.BACKEND_URL || 'http://localhost:3000',
  ...parseOriginList(process.env.EXTRA_ALLOWED_ORIGINS)
]

export function corsMiddleware () {
  const ACCEPTED_ORIGINS = isProduction() ? productionOrigins() : developmentOrigins()
  console.log('ACCEPTED_ORIGINS', ACCEPTED_ORIGINS)

  return cors({
    origin: (origin, callback) => callback(null, !origin || ACCEPTED_ORIGINS.includes(origin))
  })
}
