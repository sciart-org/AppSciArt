import { onEvent } from './socketEvents.js'
import { checkCanEditGroupMap, currentGroupMapOf } from './hackathonRooms.js'
import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'
import { errorThrower } from '../services/errorThrower.js'

const openGroupMaps = new Map()
let io = null

const startingMap = () => ({
  nodes: [
    { id: 'n0', position: { x: 0, y: 0 }, data: { label: 'ASTER+S' }, type: 'text' }
  ],
  edges: []
})

const storedMapOf = async (groupId) => {
  const conceptualMap = await GroupsAndTeamsRepository.getMinimalConceptualMap(groupId)
  return conceptualMap?.map ?? startingMap()
}

const openGroupMapOf = ({ hackathonId, groupId, room }) => {
  if (!openGroupMaps.has(room)) {
    const loaded = storedMapOf(groupId)
    loaded.catch(() => openGroupMaps.delete(room))
    openGroupMaps.set(room, { hackathonId, groupId, loaded })
  }
  return openGroupMaps.get(room).loaded
}

const hasSocketsIn = (room) => io.sockets.adapter.rooms.has(room)

const storeMap = async (room) => {
  const { groupId, loaded } = openGroupMaps.get(room)
  const conceptualMap = await GroupsAndTeamsRepository.getConceptualMap(groupId)
  if (!conceptualMap) return
  conceptualMap.map = await loaded
  await conceptualMap.save()
}

const storeAndCloseMap = async (room) => {
  await storeMap(room)
  if (!hasSocketsIn(room)) openGroupMaps.delete(room)
}

export const storeUnusedGroupMaps = () => {
  for (const room of openGroupMaps.keys()) {
    if (hasSocketsIn(room)) continue
    storeAndCloseMap(room).catch((error) => console.error(`The conceptual map of ${room} could not be stored:`, error))
  }
}

export const storeAndDeleteAllGroupsOfHackathon = async (hackathonId) => {
  const roomsOfHackathon = [...openGroupMaps]
    .filter(([, openGroupMap]) => openGroupMap.hackathonId === hackathonId)
    .map(([room]) => room)
  await Promise.all(roomsOfHackathon.map(async (room) => {
    await storeMap(room)
    openGroupMaps.delete(room)
  }))
}

const isItem = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value) &&
  typeof value.id === 'string' && value.id.length > 0

const checkIsItemList = (value, name) =>
  errorThrower(!Array.isArray(value) || !value.every(isItem), `The ${name} must be a list of items with a text id`, 400)

const onMapPartUpdate = (socket, event, part, broadcastEvent) => {
  onEvent(socket, event, async (items) => {
    const groupMap = currentGroupMapOf(socket)
    checkCanEditGroupMap(socket)
    checkIsItemList(items, part)
    const openGroupMap = await openGroupMapOf(groupMap)
    openGroupMap[part] = items
    socket.to(groupMap.room).emit(broadcastEvent, items)
  })
}

export function initializeDiagramming (socketIoInstance) {
  io = socketIoInstance
}

export function onConnectDiagramming (socket) {
  onEvent(socket, 'get_initial_state', async () => {
    const groupMap = currentGroupMapOf(socket)
    socket.emit('initial_state', await openGroupMapOf(groupMap))
  })

  onMapPartUpdate(socket, 'update_nodes', 'nodes', 'new_nodes')
  onMapPartUpdate(socket, 'update_edges', 'edges', 'new_edges')
}
