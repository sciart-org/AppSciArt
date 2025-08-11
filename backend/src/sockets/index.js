import { Server } from 'socket.io'

export function initializeWebSockets (server) {
  const FRONTEND_URL = process.env.FRONTEND_URL
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on('join_room', (hackathonId) => {
      socket.join(hackathonId)
      console.log(`User ${socket.id} joined room ${hackathonId}`)
    })

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
    })
  })

  return io
}
