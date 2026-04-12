import { Server } from 'socket.io'
import { initializeDiagramming, onConnectDiagramming, onDisconnectDiagramming, onJoinDiagramming } from './diagramming.js'
import { onConnectPresentations } from './presentations.js'
import { useJwtAuthorization } from './socketUtils.js'

const onConnect = (socket) => {
  console.log(`User connected: ${socket.id}`)
  onConnectDiagramming(socket)
  onConnectPresentations(socket)
}

const onJoinRoom = (socket, room) => {
  socket.join(room)
  onJoinDiagramming(room)
  console.log(`User ${socket.id} joined room ${room}`)
}

const onDisconnect = (socket) => {
  console.log(`User disconnected: ${socket.id}`)
  onDisconnectDiagramming()
}

let io = null

export const getIo = () => io

export function initializeWebSockets (server) {
  const FRONTEND_URL = process.env.FRONTEND_URL
  io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  })

  useJwtAuthorization(io)
  initializeDiagramming(io)

  io.on('connection', (socket) => {
    onConnect(socket)

    socket.on('join_room', (room) => {
      onJoinRoom(socket, room)
    })

    socket.on('disconnect', () => {
      onDisconnect(socket)
    })
  })

  return io
}
