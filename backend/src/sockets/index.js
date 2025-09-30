import { Server } from 'socket.io'
import { initializeDiagramming, onConnectDiagramming, onDisconnectDiagramming, onJoinDiagramming } from './diagramming.js'

export function initializeWebSockets (server) {
  const FRONTEND_URL = process.env.FRONTEND_URL
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  })

  initializeDiagramming(io)

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    onConnectDiagramming(socket)

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
