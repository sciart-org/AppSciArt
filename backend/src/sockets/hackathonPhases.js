import { getIo } from './index.js'

const emitHackathonUpdateToParticipants = (hackathonId, changes) => {
  const io = getIo()
  io?.to(hackathonId).emit('hackathon:updated', { id: hackathonId, ...changes })
}

const emitHackathonUpdateToStaff = (hackathonId, changes) => {
  const io = getIo()
  io?.to(`${hackathonId}/staff`).emit('hackathon:updated', { id: hackathonId, ...changes })
}

const emitParticipationUpdateToStaff = (hackathonId, participationId, changes) => {
  const io = getIo()
  io?.to(`${hackathonId}/staff`).emit('participation:updated', { id: participationId, ...changes })
}

const emitParticipationUpdateToParticipants = (hackathonId) => {
  const io = getIo()
  io?.to(hackathonId).emit('participation:updated')
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
