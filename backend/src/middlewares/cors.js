import cors from 'cors'

export function corsMiddleware () {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080'

  return cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        FRONTEND_URL
      ]
      if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        return callback(null, true)
      } else {
        return callback(new Error('Not allowed by CORS'))
      }
    }
  }
  )
}
