import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'

const rooms = {}
let io = null

const loadInitialRoom = async (room) => {
  if (room.includes('group') && !rooms[room]) {
    rooms[room] = await getMapOfGroup(room)
  }
}

const getMapOfGroup = async (group) => {
  const conceptualMapId = group.split('/group/')[1]
  const conceptualMap = await GroupsAndTeamsRepository.getMinimalConceptualMap(conceptualMapId)
  if (!conceptualMap || !conceptualMap.map) {
    return {
      nodes: [
        { id: 'n0', position: { x: 0, y: 0 }, data: { label: 'ASTER+S' }, type: 'text' }
      ],
      edges: []
    }
  }
  return conceptualMap.map
}

const storeEmptyRooms = () => {
  const inMemoryGroups = Object.keys(rooms)
  const activeGroups = [...io.sockets.adapter.rooms].filter(([key]) => key.includes('group')).map(([key, value]) => key)
  const groupsToStore = inMemoryGroups.filter(room => !activeGroups.includes(room))

  for (const group of groupsToStore) {
    storeMapOfGroup(group).then(() => {
      delete rooms[group]
    })
  }
}

const storeMapOfGroup = async (group) => {
  const conceptualMapId = group.split('/group/')[1]
  const conceptualMap = await GroupsAndTeamsRepository.getConceptualMap(conceptualMapId)
  if (!conceptualMap) return
  conceptualMap.map = rooms[group]
  await conceptualMap.save()
}

export function initializeDiagramming (socketIoInstance) {
  io = socketIoInstance
}

export function onConnectDiagramming (socket) {
  socket.on('get_initial_state', (room) => {
    socket.emit('initial_state', rooms[room])
  })

  socket.on('update_nodes', ({ room, nodes }) => {
    if (!room) return
    rooms[room].nodes = nodes
    socket.to(room).emit('new_nodes', nodes)
  })

  socket.on('update_edges', ({ room, edges }) => {
    if (!room) return
    rooms[room].edges = edges
    socket.to(room).emit('new_edges', edges)
  })
}

export function onJoinDiagramming (room) {
  loadInitialRoom(room)
}

export function onDisconnectDiagramming () {
  storeEmptyRooms()
}
