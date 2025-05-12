import cors from 'cors'

export function corsMiddleware () {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
  const ACCEPTED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    FRONTEND_URL,
    BACKEND_URL
  ]
  console.log('ACCEPTED_ORIGINS', ACCEPTED_ORIGINS)

  return cors({
    origin: (origin, callback) => {
      if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        return callback(null, true)
      } else {
        return callback(new Error('Not allowed by CORS'))
      }
    }
  }
  )
}
