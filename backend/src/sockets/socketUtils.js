import { bearerJwt } from '@oas-tools/auth/handlers'

export const getUserIdFromSocket = (socket) => {
  return socket.request.user.sub || null
}

export const useJwtAuthorization = (io) => {
  const JWT_SECRET = process.env.JWT_SECRET
  const JWT_ISSUER = process.env.JWT_ISSUER

  const verifyJwt = bearerJwt({ issuer: JWT_ISSUER, secret: JWT_SECRET })

  io.engine.use((req, res, next) => {
    const isHandshake = req._query.sid === undefined
    if (!isHandshake) return next()

    const header = req.headers.authorization
    if (!header) return next(new Error('no token'))

    try {
      const decoded = verifyJwt(header)
      req.user = decoded
      next()
    } catch (err) {
      next(new Error('Invalid token'))
    }
  })
}
