import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'
import * as HackathonsRepository from '../repositories/hackathonsRepository.js'
import * as ParticipationsRepository from '../repositories/participationsRepository.js'
import { errorThrower } from '../services/errorThrower.js'
import { ROLES } from '../services/Roles.js'
import { checkHasRole } from '../validators/userValidators.js'
import { onEvent } from './socketEvents.js'
import { userProfileIdOf } from './socketSession.js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const ONGOING_STATE = 'CLOSED'

export const participantsRoomOf = (hackathonId) => `${hackathonId}`
export const managementRoomOf = (hackathonId) => `${hackathonId}/staff`
export const groupRoomOf = (hackathonId, groupId) => `${hackathonId}/group/${groupId}`

const isId = (value) => typeof value === 'string' && UUID_PATTERN.test(value)

const checkIsId = (value, name) => errorThrower(!isId(value), `A valid ${name} id is required`, 400)

const checkIsOngoing = async (hackathonId) => {
  const hackathon = await HackathonsRepository.getHackathonState(hackathonId)
  errorThrower(!hackathon, 'Hackathon not found', 404)
  errorThrower(hackathon.state !== ONGOING_STATE, 'The hackathon is not ongoing', 409)
}

const roleInHackathon = async (userId, hackathonId) => {
  if (await checkHasRole(userId, ROLES.STAFF)) return ROLES.STAFF
  if (await checkHasRole(userId, ROLES.EVALUATOR, { hackathonId })) return ROLES.EVALUATOR
  if (await checkHasRole(userId, ROLES.PARTICIPANT, { hackathonId })) return ROLES.PARTICIPANT
  return null
}

export const isManagementRole = (role) => role === ROLES.STAFF || role === ROLES.EVALUATOR

const groupIdOfParticipant = async (userId, hackathonId) => {
  const participation = await ParticipationsRepository.getMinimalParticipationOfUserInHackathon(userId, { hackathonId })
  return participation?.groupId ?? null
}

const groupMapOf = (hackathonId, groupId) => ({ groupId, room: groupRoomOf(hackathonId, groupId) })

const participantGroupMapOf = async (userId, hackathonId, role) => {
  if (role !== ROLES.PARTICIPANT) return null
  const groupId = await groupIdOfParticipant(userId, hackathonId)
  return groupId ? groupMapOf(hackathonId, groupId) : null
}

const roomsToJoin = (hackathonId, role, groupMap) => {
  const participantsRoom = participantsRoomOf(hackathonId)
  if (isManagementRole(role)) return [participantsRoom, managementRoomOf(hackathonId)]
  if (!groupMap) return [participantsRoom]
  return [participantsRoom, groupMap.room]
}

const leaveRooms = (socket, rooms) => {
  for (const room of rooms) socket.leave(room)
}

const leaveHackathon = (socket) => {
  leaveRooms(socket, socket.data.hackathon?.joinedRooms ?? [])
  stopWatchingGroup(socket)
  socket.data.hackathon = null
}

const joinHackathon = async (socket, hackathonId) => {
  checkIsId(hackathonId, 'hackathon')
  await checkIsOngoing(hackathonId)
  const userId = userProfileIdOf(socket)
  const role = await roleInHackathon(userId, hackathonId)
  errorThrower(!role, 'You cannot enter this hackathon', 403)
  const groupMap = await participantGroupMapOf(userId, hackathonId, role)
  const joinedRooms = roomsToJoin(hackathonId, role, groupMap)
  leaveHackathon(socket)
  socket.join(joinedRooms)
  socket.data.hackathon = { id: hackathonId, role, joinedRooms, groupMap }
}

const stopWatchingGroup = (socket) => {
  if (socket.data.watchedGroupMap) socket.leave(socket.data.watchedGroupMap.room)
  socket.data.watchedGroupMap = null
}

const watchGroup = async (socket, groupId) => {
  const hackathon = socket.data.hackathon
  errorThrower(!isManagementRole(hackathon?.role), 'Only staff and evaluators can watch a group', 403)
  checkIsId(groupId, 'group')
  const groupMap = await GroupsAndTeamsRepository.getConceptualMapOfHackathon(groupId, hackathon.id)
  errorThrower(!groupMap, 'Group not found in this hackathon', 404)
  stopWatchingGroup(socket)
  socket.data.watchedGroupMap = groupMapOf(hackathon.id, groupId)
  socket.join(socket.data.watchedGroupMap.room)
}

export const joinedHackathonIdOf = (socket) => {
  const hackathonId = socket.data.hackathon?.id
  errorThrower(!hackathonId, 'Enter the hackathon first', 403)
  return hackathonId
}

export const currentGroupMapOf = (socket) => {
  const hackathonId = joinedHackathonIdOf(socket)
  const { role, groupMap } = socket.data.hackathon
  if (role === ROLES.PARTICIPANT) {
    errorThrower(!groupMap, 'You are not in a group yet', 403)
    return { hackathonId, ...groupMap }
  }
  errorThrower(!socket.data.watchedGroupMap, 'Choose a group to watch first', 403)
  return { hackathonId, ...socket.data.watchedGroupMap }
}

export const checkCanEditGroupMap = (socket) => {
  errorThrower(socket.data.hackathon.role === ROLES.EVALUATOR, 'Evaluators can only watch the map', 403)
}

export const onConnectHackathonRooms = (socket, onStopWatchingGroup) => {
  onEvent(socket, 'join_hackathon_rooms', (hackathonId) => joinHackathon(socket, hackathonId))
  onEvent(socket, 'watch_group', (groupId) => watchGroup(socket, groupId))
  onEvent(socket, 'stop_watching_group', () => {
    stopWatchingGroup(socket)
    onStopWatchingGroup()
  })
}
