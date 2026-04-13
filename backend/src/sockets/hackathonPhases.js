import { getIo } from './index.js'

export const emitHackathonUpdate = (hackathonId, changes) => {
  const io = getIo()
  io?.to(hackathonId).emit('hackathon:updated', { id: hackathonId, ...changes })
}

export const emitParticipationUpdateToStaff = (hackathonId, participationId, changes) => {
  const io = getIo()
  io?.to(`${hackathonId}/staff`).emit('participation:updated', { id: participationId, ...changes })
}
