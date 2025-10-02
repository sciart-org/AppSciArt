const presentingGroups = {}

export function onConnectPresentations (socket) {
  socket.on('get_presenting_group', (clusterRoom) => {
    if (!presentingGroups[clusterRoom]) {
      presentingGroups[clusterRoom] = 1
    }
    socket.emit('new_presenting_group', presentingGroups[clusterRoom])
  })
}
