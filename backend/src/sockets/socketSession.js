import { errors as oasErrors } from '@oas-tools/commons'
import * as UsersRepository from '../repositories/usersRepository.js'

const { SecurityError } = oasErrors

const UNAUTHORIZED = 'Unauthorized'
const CONNECTION_FAILED = 'Connection failed'
const MILLISECONDS_PER_SECOND = 1000

const REFUSAL_REASON = {
  NO_TOKEN: 'no token',
  INVALID_TOKEN: 'invalid token',
  NO_USER_PROFILE: 'no user profile'
}

const refused = (reason) => {
  console.log(`Refused real-time connection: ${reason}`)
  return new Error(UNAUTHORIZED)
}

const tokenOf = (socket) => {
  const token = socket.handshake.auth?.token
  return typeof token === 'string' && token.length > 0 ? token : null
}

const sessionOf = async (token, verifyAccessToken) => {
  const { sub, exp } = await verifyAccessToken(`Bearer ${token}`)
  const userProfile = await UsersRepository.getMinimalUserProfileByAuthId(sub)
  if (!userProfile) return null
  return { userProfileId: userProfile.id, expiresAt: exp * MILLISECONDS_PER_SECOND }
}

export const authenticateSockets = (io, verifyAccessToken) => {
  io.use(async (socket, next) => {
    const token = tokenOf(socket)
    if (!token) return next(refused(REFUSAL_REASON.NO_TOKEN))
    try {
      const session = await sessionOf(token, verifyAccessToken)
      if (!session) return next(refused(REFUSAL_REASON.NO_USER_PROFILE))
      socket.data = session
      next()
    } catch (error) {
      if (error instanceof SecurityError) return next(refused(REFUSAL_REASON.INVALID_TOKEN))
      console.error('A real-time connection could not be authenticated:', error)
      next(new Error(CONNECTION_FAILED))
    }
  })
}

const hasExpired = (socket) => Date.now() >= socket.data.expiresAt

const endSession = (socket) => {
  if (!socket.connected) return
  socket.emit('session_expired')
  socket.disconnect()
}

export const closeWhenSessionExpires = (socket) => {
  const timer = setTimeout(() => endSession(socket), socket.data.expiresAt - Date.now())
  socket.on('disconnect', () => clearTimeout(timer))
  socket.use((packet, next) => {
    if (hasExpired(socket)) return endSession(socket)
    next()
  })
}

export const userProfileIdOf = (socket) => socket.data.userProfileId
