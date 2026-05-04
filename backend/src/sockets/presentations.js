import { getHackathonExploringGroups, getConceptualMap } from '../services/groupsAndTeamsService.js'
import { getUserIdFromSocket } from './socketUtils.js'

const presentingGroups = {}
const ratings = {}

async function getPreviousGroupSeeds (socket, clusterRoom) {
  const hackathonId = clusterRoom.split('/cluster/')[0]
  const groups = await getHackathonExploringGroups(hackathonId)
  const visitedGroups = [...presentingGroups[clusterRoom].previous, presentingGroups[clusterRoom].current]

  const uniqueGroups = [...new Set(visitedGroups)]
  const previousSeeds = []

  for (const groupNumber of uniqueGroups) {
    const groupToSearchId = groups.find(g => g.number === groupNumber)?.id
    if (!groupToSearchId) continue
    const conceptualMap = await getConceptualMap(getUserIdFromSocket(socket), groupToSearchId)
    previousSeeds.push({ ...conceptualMap.seed.toJSON(), groupNumber })
  }
  return previousSeeds
}

export function onConnectPresentations (socket) {
  socket.on('get_presenting_state', (clusterRoom) => {
    if (!presentingGroups[clusterRoom]) {
      presentingGroups[clusterRoom] = { current: 1, previous: [] }
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
        presentingGroup: presentingGroups[clusterRoom].current,
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

  socket.on('set_presenting_group', ({ room, groupNumber }) => {
    presentingGroups[room].previous.push(presentingGroups[room].current)
    presentingGroups[room].current = groupNumber
    socket.to(room).emit('new_presenting_group', groupNumber)
  })
}
