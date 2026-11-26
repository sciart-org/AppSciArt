import { onEvent } from './socketEvents.js'
import { getHackathonExploringGroups, getConceptualMap } from '../services/groupsAndTeamsService.js'
import { joinedHackathonIdOf, managementRoomOf, participantsRoomOf } from './hackathonRooms.js'
import { userProfileIdOf } from './socketSession.js'

const presentingGroups = {}
const ratings = {}

async function getPreviousGroupSeeds (socket, hackathonId) {
  const groups = await getHackathonExploringGroups(hackathonId)
  const visitedGroups = [...presentingGroups[hackathonId].previous, presentingGroups[hackathonId].current]

  const uniqueGroups = [...new Set(visitedGroups)]
  const previousSeeds = []

  for (const groupNumber of uniqueGroups) {
    const groupToSearchId = groups.find(g => g.number === groupNumber)?.id
    if (!groupToSearchId) continue
    const conceptualMap = await getConceptualMap(userProfileIdOf(socket), groupToSearchId)
    previousSeeds.push({ ...conceptualMap.seed.toJSON(), groupNumber })
  }
  return previousSeeds
}

const initGroups = (hackathonId) => {
  if (!presentingGroups[hackathonId]) {
    presentingGroups[hackathonId] = { current: 1, previous: [] }
  }
  if (!ratings[hackathonId]) {
    getHackathonExploringGroups(hackathonId).then(groups => {
      ratings[hackathonId] = {
        submissionEnabled: false,
        participantRatings: {},
        numberOfGroups: groups.length
      }
    })
  }
}

const getPresentingState = (hackathonId, previousSeeds, userId = null) => {
  return {
    presentingGroup: presentingGroups[hackathonId].current,
    previousSeeds,
    submissionEnabled: ratings[hackathonId].submissionEnabled,
    hasSubmitted: userId ? ratings[hackathonId].submissionEnabled && !!ratings[hackathonId].participantRatings[userId] : null
  }
}

export function onConnectGroupPresentations (socket) {
  onEvent(socket, 'get_group_presenting_state', async () => {
    const hackathonId = joinedHackathonIdOf(socket)
    initGroups(hackathonId)
    const userId = userProfileIdOf(socket)
    getPreviousGroupSeeds(socket, hackathonId).then((previousSeeds) => {
      socket.emit('group_presenting_state', getPresentingState(hackathonId, previousSeeds, userId))
    })
  })

  onEvent(socket, 'submit_ratings', async (submittedRatings) => {
    const hackathonId = joinedHackathonIdOf(socket)
    const storedRatings = ratings[hackathonId]
    if (submittedRatings.length < storedRatings.numberOfGroups) {
      socket.emit('error_message', 'You must rate all groups before submitting.')
      return
    }
    const userId = userProfileIdOf(socket)
    storedRatings.participantRatings[userId] = submittedRatings
    socket.to(managementRoomOf(hackathonId)).emit('ratings', storedRatings.participantRatings)
  })

  onEvent(socket, 'set_presenting_group', (groupNumber) => {
    const hackathonId = joinedHackathonIdOf(socket)
    presentingGroups[hackathonId].previous.push(presentingGroups[hackathonId].current)
    presentingGroups[hackathonId].current = groupNumber
    socket.to(participantsRoomOf(hackathonId)).emit('new_presenting_group', groupNumber)
  })

  onEvent(socket, 'enable_ratings_submission', () => {
    const hackathonId = joinedHackathonIdOf(socket)
    if (ratings[hackathonId].submissionEnabled) return
    ratings[hackathonId].submissionEnabled = true
    getHackathonExploringGroups(hackathonId).then(groups => {
      presentingGroups[hackathonId].previous = groups.map(g => g.number)
    })
    socket.to(participantsRoomOf(hackathonId)).emit('ratings_submission_enabled')
    getPreviousGroupSeeds(socket, hackathonId).then((previousSeeds) => {
      const presentingState = getPresentingState(hackathonId, previousSeeds)
      socket.to(participantsRoomOf(hackathonId)).emit('group_presenting_state', presentingState)
    })
  })

  onEvent(socket, 'get_ratings', () => {
    const hackathonId = joinedHackathonIdOf(socket)
    socket.emit('ratings', ratings[hackathonId]?.participantRatings)
  })
}
