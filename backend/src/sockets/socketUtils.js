import * as UsersRepository from '../repositories/usersRepository.js'

const getUserIdFromSocket = (socket) => {
  return socket.request.user.sub || null
}

export const getUserProfileIdFromSocket = async (socket) => {
  const authId = getUserIdFromSocket(socket)
  const userProfile = await UsersRepository.getMinimalUserProfileByAuthId(authId)
  return userProfile?.id
}

export const useJwtAuthorization = (io, verifyAccessToken) => {
  io.engine.use(async (req, res, next) => {
    const isHandshake = req._query.sid === undefined
    if (!isHandshake) return next()

    const header = req.headers.authorization
    if (!header) return next(new Error('no token'))

    try {
      req.user = await verifyAccessToken(header)
      next()
    } catch (err) {
      next(new Error('Invalid token'))
    }
  })
}
