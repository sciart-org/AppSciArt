import { toPlainObject } from '../services/mappers/utils.js'
import { getIo } from './index.js'

const emitHackathonUpdateToParticipants = (hackathonId, changes) => {
  const io = getIo()
  io?.to(hackathonId).emit('hackathon:updated', { id: hackathonId, ...toPlainObject(changes) })
}

const emitHackathonUpdateToStaff = (hackathonId, changes) => {
  const io = getIo()
  io?.to(`${hackathonId}/staff`).emit('hackathon:updated', { id: hackathonId, ...toPlainObject(changes) })
}

const emitParticipationUpdateToStaff = (hackathonId, participationId, changes) => {
  const io = getIo()
  io?.to(`${hackathonId}/staff`).emit('participation:updated', { id: participationId, ...toPlainObject(changes) })
}

const emitParticipationUpdateToParticipants = (hackathonId) => {
  const io = getIo()
  io?.to(hackathonId).emit('participation:updated')
}

export const emitGroupUpdateToStaff = (hackathonId, groupId, changes) => {
  const io = getIo()
  io?.to(`${hackathonId}/staff`).emit('group:updated', { id: groupId, ...toPlainObject(changes) })
}

export const emitTeamUpdateToStaff = (hackathonId, teamId, changes) => {
  const io = getIo()
  io?.to(`${hackathonId}/staff`).emit('team:updated', { id: teamId, ...toPlainObject(changes) })
}

export const emitGroupRemovedToStaff = (hackathonId, groupId) => {
  const io = getIo()
  io?.to(`${hackathonId}/staff`).emit('group:removed', groupId)
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
  emitHackathonUpdateToStaff(hackathonId, updatedHackathon)
  if (broadcast === 'ALL') {
    emitHackathonUpdateToParticipants(hackathonId, updatedHackathon)
  }
}

export const broadcastParticipationUpdate = (broadcast, hackathonId, participationId, updatedParticipation) => {
  if (!broadcast || broadcast === 'NONE') return
  emitParticipationUpdateToStaff(hackathonId, participationId, updatedParticipation)
  if (broadcast === 'ALL') {
    emitParticipationUpdateToParticipants(hackathonId)
  }
}
