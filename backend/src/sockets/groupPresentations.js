import { getHackathonExploringGroups, getConceptualMap } from '../services/groupsAndTeamsService.js'
import { getUserProfileIdFromSocket } from './socketUtils.js'

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
    const conceptualMap = await getConceptualMap(await getUserProfileIdFromSocket(socket), groupToSearchId)
    previousSeeds.push({ ...conceptualMap.seed.toJSON(), groupNumber })
  }
  return previousSeeds
}

const initGroups = (clusterRoom) => {
  if (!presentingGroups[clusterRoom]) {
    presentingGroups[clusterRoom] = { current: 1, previous: [] }
  }
  if (!ratings[clusterRoom]) {
    const hackathonId = clusterRoom.split('/cluster/')[0]
    getHackathonExploringGroups(hackathonId).then(groups => {
      ratings[clusterRoom] = {
        submissionEnabled: false,
        participantRatings: {},
        numberOfGroups: groups.length
      }
    })
  }
}

const getPresentingState = (clusterRoom, previousSeeds, userId = null) => {
  return {
    presentingGroup: presentingGroups[clusterRoom].current,
    previousSeeds,
    submissionEnabled: ratings[clusterRoom].submissionEnabled,
    hasSubmitted: userId ? ratings[clusterRoom].submissionEnabled && !!ratings[clusterRoom].participantRatings[userId] : null
  }
}

export function onConnectGroupPresentations (socket) {
  socket.on('get_group_presenting_state', async (clusterRoom) => {
    initGroups(clusterRoom)
    const userId = await getUserProfileIdFromSocket(socket)
    getPreviousGroupSeeds(socket, clusterRoom).then((previousSeeds) => {
      socket.emit('group_presenting_state', getPresentingState(clusterRoom, previousSeeds, userId))
    })
  })

  socket.on('submit_ratings', async (clusterRoom, submittedRatings) => {
    const storedRatings = ratings[clusterRoom]
    if (submittedRatings.length < storedRatings.numberOfGroups) {
      socket.emit('error_message', 'You must rate all groups before submitting.')
      return
    }
    const userId = await getUserProfileIdFromSocket(socket)
    storedRatings.participantRatings[userId] = submittedRatings
    const hackathonId = clusterRoom.split('/cluster/')[0]
    socket.to(`${hackathonId}/staff`).emit('ratings', storedRatings.participantRatings)
  })

  socket.on('set_presenting_group', ({ room, groupNumber }) => {
    presentingGroups[room].previous.push(presentingGroups[room].current)
    presentingGroups[room].current = groupNumber
    socket.to(room).emit('new_presenting_group', groupNumber)
    const hackathonId = room.split('/cluster/')[0]
    socket.to(`${hackathonId}/staff`).emit('new_presenting_group', groupNumber)
  })

  socket.on('enable_ratings_submission', (room) => {
    if (ratings[room].submissionEnabled) return
    ratings[room].submissionEnabled = true
    const hackathonId = room.split('/cluster/')[0]
    getHackathonExploringGroups(hackathonId).then(groups => {
      presentingGroups[room].previous = groups.map(g => g.number)
    })
    socket.to(room).emit('ratings_submission_enabled')
    socket.to(`${hackathonId}/staff`).emit('ratings_submission_enabled')
    getPreviousGroupSeeds(socket, room).then((previousSeeds) => {
      const presentingState = getPresentingState(room, previousSeeds)
      socket.to(room).emit('group_presenting_state', presentingState)
      socket.to(`${hackathonId}/staff`).emit('group_presenting_state', presentingState)
    })
  })

  socket.on('get_ratings', (room) => {
    socket.emit('ratings', ratings[room]?.participantRatings)
  })
}
