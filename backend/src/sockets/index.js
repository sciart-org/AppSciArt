import { Server } from 'socket.io'
import { initializeDiagramming, onConnectDiagramming, onDisconnectDiagramming, onJoinDiagramming } from './diagramming.js'
import { onConnectPresentations } from './presentations.js'
import { bearerJwt } from '@oas-tools/auth/handlers'

export const getUserIdFromSocket = (socket) => {
  return socket.request.user.sub || null
}

const useJwtAuthorization = (io) => {
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

export function initializeWebSockets (server) {
  const FRONTEND_URL = process.env.FRONTEND_URL
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  })

  useJwtAuthorization(io)
  initializeDiagramming(io)

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    onConnectDiagramming(socket)
    onConnectPresentations(socket)

    socket.on('join_room', (room) => {
      socket.join(room)
      onJoinDiagramming(room)
      console.log(`User ${socket.id} joined room ${room}`)
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
      onDisconnectDiagramming()
    })
  })

  return io
}
