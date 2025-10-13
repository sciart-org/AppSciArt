import { getClusterExploringGroups, getConceptualMap } from '../services/groupsAndTeamsService.js'
import { getUserIdFromSocket } from './index.js'

const presentingGroups = {}

async function getPreviousGroupSeeds (socket, clusterRoom) {
  const hackathonId = clusterRoom.split('/cluster/')[0]
  const clusterNumber = clusterRoom.split('/cluster/')[1]
  const groups = await getClusterExploringGroups(hackathonId, clusterNumber)
  const previousSeeds = []

  for (let groupNumber = 1; groupNumber < presentingGroups[clusterRoom]; groupNumber++) {
    const groupToSearchId = groups.filter(g => g.number === groupNumber)[0]?.id
    if (!groupToSearchId) continue
    const conceptualMap = await getConceptualMap(getUserIdFromSocket(socket), groupToSearchId)
    previousSeeds.push({ ...conceptualMap.seed.toJSON(), groupNumber })
  }

  return previousSeeds
}

export function onConnectPresentations (socket) {
  socket.on('get_presenting_state', (clusterRoom) => {
    if (!presentingGroups[clusterRoom]) {
      presentingGroups[clusterRoom] = 1
    }

    getPreviousGroupSeeds(socket, clusterRoom).then((previousSeeds) => {
      socket.emit('presenting_state', { presentingGroup: presentingGroups[clusterRoom], previousSeeds })
    })
  })
}
