import { errorThrower } from '../services/errorThrower.js'
import { getHackathonCoCreationTeams } from '../services/groupsAndTeamsService.js'
import { ROLES } from '../services/Roles.js'
import { joinedHackathonIdOf, participantsRoomOf } from './hackathonRooms.js'
import { onEvent } from './socketEvents.js'
import { userProfileIdOf } from './socketSession.js'

const FIRST_TEAM_NUMBER = 1

const teamPresentations = new Map()

const teamPresentationOf = (hackathonId) => {
  if (!teamPresentations.has(hackathonId)) {
    teamPresentations.set(hackathonId, { presentingTeamNumber: FIRST_TEAM_NUMBER })
  }
  return teamPresentations.get(hackathonId)
}

const roleOf = (socket) => socket.data.hackathon.role

const checkIsStaff = (socket) =>
  errorThrower(roleOf(socket) !== ROLES.STAFF, 'Only staff can manage team presentations', 403)

const isTeamNumber = (value) => Number.isInteger(value) && value >= FIRST_TEAM_NUMBER

const teamCountOf = async (socket, hackathonId) => {
  const teams = await getHackathonCoCreationTeams(userProfileIdOf(socket), hackathonId)
  return teams.length
}

const checkIsTeamOf = async (socket, hackathonId, teamNumber) => {
  errorThrower(!isTeamNumber(teamNumber), 'A valid team number is required', 400)
  const teamCount = await teamCountOf(socket, hackathonId)
  errorThrower(teamNumber > teamCount, 'Team not found in this hackathon', 404)
}

const presentingStateOf = (hackathonId) => {
  return {
    presentingTeam: teamPresentationOf(hackathonId).presentingTeamNumber
  }
}

export function onConnectTeamPresentations (socket) {
  onEvent(socket, 'get_team_presenting_state', () => {
    const hackathonId = joinedHackathonIdOf(socket)
    socket.emit('team_presenting_state', presentingStateOf(hackathonId))
  })

  onEvent(socket, 'set_presenting_team', async (teamNumber) => {
    const hackathonId = joinedHackathonIdOf(socket)
    checkIsStaff(socket)
    await checkIsTeamOf(socket, hackathonId, teamNumber)
    teamPresentationOf(hackathonId).presentingTeamNumber = teamNumber
    socket.to(participantsRoomOf(hackathonId)).emit('new_presenting_team', teamNumber)
  })
}
