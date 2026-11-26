import { onEvent } from './socketEvents.js'
const presentingTeams = {}

const initTeams = (clusterRoom) => {
  if (!presentingTeams[clusterRoom]) {
    presentingTeams[clusterRoom] = { current: 1, previous: [] }
  }
}

const getPresentingState = (clusterRoom) => {
  return {
    presentingTeam: presentingTeams[clusterRoom].current
  }
}

export function onConnectTeamPresentations (socket) {
  onEvent(socket, 'get_team_presenting_state', (clusterRoom) => {
    initTeams(clusterRoom)
    socket.emit('team_presenting_state', getPresentingState(clusterRoom))
  })

  onEvent(socket, 'set_presenting_team', ({ room, teamNumber }) => {
    presentingTeams[room].previous.push(presentingTeams[room].current)
    presentingTeams[room].current = teamNumber
    socket.to(room).emit('new_presenting_team', teamNumber)
    const hackathonId = room.split('/cluster/')[0]
    socket.to(`${hackathonId}/staff`).emit('new_presenting_team', teamNumber)
  })
}
