import { Server } from 'socket.io'
import { initializeDiagramming, onConnectDiagramming, onDisconnectDiagramming } from './diagramming.js'
import { onConnectGroupPresentations } from './groupPresentations.js'
import { useJwtAuthorization } from './socketUtils.js'
import { onConnectTeamPresentations } from './teamPresentations.js'

const onConnect = (socket) => {
  console.log(`User connected: ${socket.id}`)
  onConnectDiagramming(socket)
  onConnectGroupPresentations(socket)
  onConnectTeamPresentations(socket)
}

const onJoinRoom = (socket, room) => {
  socket.join(room)
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

    socket.on('leave_room', (room) => {
      socket.leave(room)
      console.log(`User ${socket.id} left room ${room}`)
      onDisconnectDiagramming()
    })
  })

  return io
}
