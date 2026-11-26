import { joinedHackathonIdOf, participantsRoomOf } from './hackathonRooms.js'
import { onEvent } from './socketEvents.js'

const presentingTeams = {}

const initTeams = (hackathonId) => {
  if (!presentingTeams[hackathonId]) {
    presentingTeams[hackathonId] = { current: 1, previous: [] }
  }
}

const getPresentingState = (hackathonId) => {
  return {
    presentingTeam: presentingTeams[hackathonId].current
  }
}

export function onConnectTeamPresentations (socket) {
  onEvent(socket, 'get_team_presenting_state', () => {
    const hackathonId = joinedHackathonIdOf(socket)
    initTeams(hackathonId)
    socket.emit('team_presenting_state', getPresentingState(hackathonId))
  })

  onEvent(socket, 'set_presenting_team', (teamNumber) => {
    const hackathonId = joinedHackathonIdOf(socket)
    presentingTeams[hackathonId].previous.push(presentingTeams[hackathonId].current)
    presentingTeams[hackathonId].current = teamNumber
    socket.to(participantsRoomOf(hackathonId)).emit('new_presenting_team', teamNumber)
  })
}
