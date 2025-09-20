import { Server } from 'socket.io'

export function initializeWebSockets (server) {
  const FRONTEND_URL = process.env.FRONTEND_URL
  const io = new Server(server, {
    cors: {
      origin: FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  })

  const rooms = {}

  const storeEmptyRooms = () => {
    const inMemoryGroups = Object.keys(rooms)
    const activeGroups = [...io.sockets.adapter.rooms].filter(([key]) => key.includes('group')).map(([key, value]) => key)
    const groupsToStore = inMemoryGroups.filter(room => !activeGroups.includes(room))
    // Store group to DB
    for (const group of groupsToStore) {
      console.log(JSON.stringify(rooms[group]))
    }
  }

  const loadInitialRoom = (room) => {
    if (room.includes('group') && !rooms[room]) {
      rooms[room] = {
        nodes: [
          { id: 'n0', position: { x: 0, y: 0 }, data: { label: 'ASTER+S' }, type: 'text' }
        ],
        edges: []
      }
    }
  }

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`)

    socket.on('join_room', (room) => {
      socket.join(room)
      loadInitialRoom(room)
      console.log(`User ${socket.id} joined room ${room}`)
    })

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

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`)
      storeEmptyRooms()
    })
  })

  return io
}
