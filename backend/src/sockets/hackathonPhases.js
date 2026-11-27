import { toPlainObject } from '../services/mappers/utils.js'
import { managementRoomOf, participantsRoomOf } from './hackathonRooms.js'
import { getIo } from './index.js'

const everyoneIn = (hackathonId) => [participantsRoomOf(hackathonId), managementRoomOf(hackathonId)]

const roomsFor = (broadcast, hackathonId) =>
  broadcast === 'ALL' ? everyoneIn(hackathonId) : [managementRoomOf(hackathonId)]

const emitHackathonUpdate = (broadcast, hackathonId, changes) => {
  const io = getIo()
  io?.to(roomsFor(broadcast, hackathonId)).emit('hackathon:updated', { id: hackathonId, ...toPlainObject(changes) })
}

const emitParticipationUpdateToStaff = (hackathonId, participationId, changes) => {
  const io = getIo()
  io?.to(managementRoomOf(hackathonId)).emit('participation:updated', { id: participationId, ...toPlainObject(changes) })
}

const emitParticipationUpdateToParticipants = (hackathonId) => {
  const io = getIo()
  io?.to(participantsRoomOf(hackathonId)).except(managementRoomOf(hackathonId)).emit('participation:updated')
}

const emitGroupUpdateToStaff = (hackathonId, groupId, changes) => {
  const io = getIo()
  io?.to(managementRoomOf(hackathonId)).emit('group:updated', { id: groupId, ...toPlainObject(changes) })
}

const emitTeamUpdateToStaff = (hackathonId, teamId, changes) => {
  const io = getIo()
  io?.to(managementRoomOf(hackathonId)).emit('team:updated', { id: teamId, ...toPlainObject(changes) })
}

const UNKNOWN_ID_TO_FORCE_RELOAD = null

export const emitGroupsChangedToStaff = (hackathonId) => {
  emitGroupUpdateToStaff(hackathonId, UNKNOWN_ID_TO_FORCE_RELOAD, {})
}

export const emitTeamsChangedToStaff = (hackathonId) => {
  emitTeamUpdateToStaff(hackathonId, UNKNOWN_ID_TO_FORCE_RELOAD, {})
}

export const broadcastTeamUpdate = (broadcast, hackathonId, teamId, changes) => {
  if (!broadcast || broadcast === 'NONE') return
  emitTeamUpdateToStaff(hackathonId, teamId, changes)
  if (broadcast === 'ALL') {
    emitParticipationUpdateToParticipants(hackathonId)
  }
}

export const broadcastGroupUpdate = (broadcast, hackathonId, groupId, changes) => {
  if (!broadcast || broadcast === 'NONE') return
  emitGroupUpdateToStaff(hackathonId, groupId, changes)
  if (broadcast === 'ALL') {
    emitParticipationUpdateToParticipants(hackathonId)
  }
}

export const broadcastHackathonUpdate = (broadcast, hackathonId, updatedHackathon) => {
  if (!broadcast || broadcast === 'NONE') return
  emitHackathonUpdate(broadcast, hackathonId, updatedHackathon)
}

export const broadcastParticipationUpdate = (broadcast, hackathonId, participationId, updatedParticipation) => {
  if (!broadcast || broadcast === 'NONE') return
  emitParticipationUpdateToStaff(hackathonId, participationId, updatedParticipation)
  if (broadcast === 'ALL') {
    emitParticipationUpdateToParticipants(hackathonId)
  }
}
