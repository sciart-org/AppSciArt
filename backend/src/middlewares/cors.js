import cors from 'cors'

export function corsMiddleware () {
  return cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080'
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
