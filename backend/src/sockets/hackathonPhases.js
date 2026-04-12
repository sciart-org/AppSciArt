import { getIo } from './index.js'

export const emitHackathonUpdate = (hackathonId, changes) => {
  const io = getIo()
  io?.to(hackathonId).emit('hackathon:updated', { id: hackathonId, ...changes })
}
