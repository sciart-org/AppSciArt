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

const canManage = (role) => role === ROLES.STAFF || role === ROLES.EVALUATOR

const groupOfParticipant = async (userId, hackathonId) => {
  const participation = await ParticipationsRepository.getMinimalParticipationOfUserInHackathon(userId, { hackathonId })
  return participation?.groupId ?? null
}

const roomsFor = async (userId, hackathonId, role) => {
  if (canManage(role)) return [participantsRoomOf(hackathonId), managementRoomOf(hackathonId)]
  const groupId = await groupOfParticipant(userId, hackathonId)
  const groupRooms = groupId ? [groupRoomOf(hackathonId, groupId)] : []
  return [participantsRoomOf(hackathonId), ...groupRooms]
}

const leaveRooms = (socket, rooms) => {
  for (const room of rooms) socket.leave(room)
}

const leaveHackathon = (socket) => {
  leaveRooms(socket, socket.data.hackathon?.rooms ?? [])
  stopWatching(socket)
  socket.data.hackathon = null
}

const joinHackathon = async (socket, hackathonId) => {
  checkIsId(hackathonId, 'hackathon')
  await checkIsOngoing(hackathonId)
  const userId = userProfileIdOf(socket)
  const role = await roleInHackathon(userId, hackathonId)
  errorThrower(!role, 'You cannot enter this hackathon', 403)
  const rooms = await roomsFor(userId, hackathonId, role)
  leaveHackathon(socket)
  socket.join(rooms)
  socket.data.hackathon = { id: hackathonId, role, rooms }
}

const stopWatching = (socket) => {
  if (socket.data.watchedGroupRoom) socket.leave(socket.data.watchedGroupRoom)
  socket.data.watchedGroupRoom = null
}

const watchGroup = async (socket, groupId) => {
  const hackathon = socket.data.hackathon
  errorThrower(!canManage(hackathon?.role), 'Only staff and evaluators can watch a group', 403)
  checkIsId(groupId, 'group')
  const group = await GroupsAndTeamsRepository.getConceptualMapOfHackathon(groupId, hackathon.id)
  errorThrower(!group, 'Group not found in this hackathon', 404)
  stopWatching(socket)
  socket.data.watchedGroupRoom = groupRoomOf(hackathon.id, groupId)
  socket.join(socket.data.watchedGroupRoom)
}

export const joinedHackathonIdOf = (socket) => {
  const hackathonId = socket.data.hackathon?.id
  errorThrower(!hackathonId, 'Enter the hackathon first', 403)
  return hackathonId
}

export const onConnectHackathonRooms = (socket, onLeaveGroup) => {
  onEvent(socket, 'join_hackathon_rooms', (hackathonId) => joinHackathon(socket, hackathonId))
  onEvent(socket, 'watch_group', (groupId) => watchGroup(socket, groupId))
  onEvent(socket, 'stop_watching_group', () => {
    stopWatching(socket)
    onLeaveGroup()
  })
}
