import { Server } from 'socket.io'
import { frontendOrigin } from '../middlewares/cors.js'
import { initializeDiagramming, onConnectDiagramming, onDisconnectDiagramming } from './diagramming.js'
import { onConnectGroupPresentations } from './groupPresentations.js'
import { logSocketErrors, onEvent } from './socketEvents.js'
import { authenticateSockets, closeWhenSessionExpires } from './socketSession.js'
import { onConnectTeamPresentations } from './teamPresentations.js'

const onConnect = (socket) => {
  console.log(`User connected: ${socket.id}`)
  logSocketErrors(socket)
  closeWhenSessionExpires(socket)
  onConnectDiagramming(socket)
  onConnectGroupPresentations(socket)
  onConnectTeamPresentations(socket)
}

const onJoinRoom = (socket, room) => {
  socket.join(room)
  console.log(`User ${socket.id} joined room ${room}`)
}

const onLeaveRoom = (socket, room) => {
  socket.leave(room)
  console.log(`User ${socket.id} left room ${room}`)
  onDisconnectDiagramming()
}

const onDisconnect = (socket) => {
  console.log(`User disconnected: ${socket.id}`)
  onDisconnectDiagramming()
}

let io = null

export const getIo = () => io

export function initializeWebSockets (server, verifyAccessToken) {
  io = new Server(server, {
    cors: {
      origin: frontendOrigin(),
      methods: ['GET', 'POST']
    }
  })

  authenticateSockets(io, verifyAccessToken)
  initializeDiagramming(io)

  io.on('connection', (socket) => {
    onConnect(socket)
    onEvent(socket, 'join_room', (room) => onJoinRoom(socket, room))
    onEvent(socket, 'leave_room', (room) => onLeaveRoom(socket, room))
    socket.on('disconnect', () => onDisconnect(socket))
  })

  return io
}
