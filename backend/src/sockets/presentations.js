import { getClusterExploringGroups, getConceptualMap } from '../services/groupsAndTeamsService.js'
import { getUserIdFromSocket } from './socketUtils.js'

const presentingGroups = {}
const ratings = {}

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
    if (!ratings[clusterRoom]) {
      ratings[clusterRoom] = {
        submissionEnabled: false,
        participantRatings: {}
      }
    }

    const userId = getUserIdFromSocket(socket)

    getPreviousGroupSeeds(socket, clusterRoom).then((previousSeeds) => {
      socket.emit('presenting_state', {
        presentingGroup: presentingGroups[clusterRoom],
        previousSeeds,
        submissionEnabled: ratings[clusterRoom].submissionEnabled,
        hasSubmitted: ratings[clusterRoom].submissionEnabled && !!ratings[clusterRoom].participantRatings[userId]
      })
    })
  })

  socket.on('submit_ratings', (clusterRoom, submittedRatings) => {
    const userId = getUserIdFromSocket(socket)
    ratings[clusterRoom].participantRatings[userId] = submittedRatings
    console.log(ratings[clusterRoom].participantRatings[userId])
  })
}
