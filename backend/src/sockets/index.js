import { Server } from 'socket.io'
import { frontendOrigin } from '../middlewares/cors.js'
import { initializeDiagramming, onConnectDiagramming, storeUnusedGroupMaps } from './diagramming.js'
import { onConnectGroupPresentations } from './groupPresentations.js'
import { onConnectHackathonRooms } from './hackathonRooms.js'
import { logSocketErrors } from './socketEvents.js'
import { authenticateSockets, closeWhenSessionExpires } from './socketSession.js'
import { onConnectTeamPresentations } from './teamPresentations.js'

const onConnect = (socket) => {
  console.log(`User connected: ${socket.id}`)
  logSocketErrors(socket)
  closeWhenSessionExpires(socket)
  onConnectHackathonRooms(socket, storeUnusedGroupMaps)
  onConnectDiagramming(socket)
  onConnectGroupPresentations(socket)
  onConnectTeamPresentations(socket)
}

const onDisconnect = (socket) => {
  console.log(`User disconnected: ${socket.id}`)
  storeUnusedGroupMaps()
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
    socket.on('disconnect', () => onDisconnect(socket))
  })

  return io
}
