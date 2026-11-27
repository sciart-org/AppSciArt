import { onEvent } from './socketEvents.js'
import { getHackathonExploringGroups, getConceptualMap } from '../services/groupsAndTeamsService.js'
import { errorThrower } from '../services/errorThrower.js'
import { ROLES } from '../services/Roles.js'
import { isManagementRole, joinedHackathonIdOf, managementRoomOf, participantsRoomOf } from './hackathonRooms.js'
import { userProfileIdOf } from './socketSession.js'

const FIRST_GROUP_NUMBER = 1
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const groupPresentations = new Map()

const groupPresentationOf = (hackathonId) => {
  if (!groupPresentations.has(hackathonId)) {
    groupPresentations.set(hackathonId, {
      presentingGroupNumber: FIRST_GROUP_NUMBER,
      presentedGroupNumbers: [],
      submissionEnabled: false,
      participantRatings: {}
    })
  }
  return groupPresentations.get(hackathonId)
}

const roleOf = (socket) => socket.data.hackathon.role

const checkIsStaff = (socket) =>
  errorThrower(roleOf(socket) !== ROLES.STAFF, 'Only staff can manage group presentations', 403)

const checkIsManagement = (socket) =>
  errorThrower(!isManagementRole(roleOf(socket)), 'Only staff and evaluators can see the ratings', 403)

const checkIsParticipant = (socket) =>
  errorThrower(roleOf(socket) !== ROLES.PARTICIPANT, 'Only participants can submit ratings', 403)

const isGroupNumber = (value) => Number.isInteger(value) && value >= FIRST_GROUP_NUMBER

const checkIsGroupOf = (groups, groupNumber) => {
  errorThrower(!isGroupNumber(groupNumber), 'A valid group number is required', 400)
  errorThrower(!groups.some((group) => group.number === groupNumber), 'Group not found in this hackathon', 404)
}

const isRating = (value) =>
  value !== null && typeof value === 'object' &&
  typeof value.seedId === 'string' && UUID_PATTERN.test(value.seedId) &&
  Number.isFinite(value.rating)

const checkIsRatingList = (value) =>
  errorThrower(!Array.isArray(value) || !value.every(isRating), 'The ratings must be a list of seed ids with a number', 400)

const ratesEachSeedOnce = (submittedRatings, groups) => {
  const ratedSeedIds = new Set(submittedRatings.map((rating) => rating.seedId))
  const groupSeedIds = new Set(groups.map((group) => group.seedId))
  if (ratedSeedIds.size !== submittedRatings.length || ratedSeedIds.size !== groupSeedIds.size) return false
  return [...groupSeedIds].every((seedId) => ratedSeedIds.has(seedId))
}

const checkRatesEveryGroupSeed = (submittedRatings, groups) =>
  errorThrower(!ratesEachSeedOnce(submittedRatings, groups), 'You must rate every group\'s seed once before submitting', 400)

const presentedSeedsOf = async (socket, hackathonId) => {
  const groups = await getHackathonExploringGroups(hackathonId)
  const { presentedGroupNumbers, presentingGroupNumber } = groupPresentationOf(hackathonId)
  const visitedGroupNumbers = new Set([...presentedGroupNumbers, presentingGroupNumber])

  const presentedSeeds = []
  for (const groupNumber of visitedGroupNumbers) {
    const groupId = groups.find((group) => group.number === groupNumber)?.id
    if (!groupId) continue
    const conceptualMap = await getConceptualMap(userProfileIdOf(socket), groupId)
    presentedSeeds.push({ ...conceptualMap.seed.toJSON(), groupNumber })
  }
  return presentedSeeds
}

const hasSubmitted = (groupPresentation, userProfileId) =>
  groupPresentation.submissionEnabled && !!groupPresentation.participantRatings[userProfileId]

const presentingStateOf = (hackathonId, presentedSeeds, userProfileId = null) => {
  const groupPresentation = groupPresentationOf(hackathonId)
  return {
    presentingGroup: groupPresentation.presentingGroupNumber,
    previousSeeds: presentedSeeds,
    submissionEnabled: groupPresentation.submissionEnabled,
    hasSubmitted: userProfileId ? hasSubmitted(groupPresentation, userProfileId) : null
  }
}

const sendPresentingState = async (socket) => {
  const hackathonId = joinedHackathonIdOf(socket)
  const userProfileId = userProfileIdOf(socket)
  const presentedSeeds = await presentedSeedsOf(socket, hackathonId)
  socket.emit('group_presenting_state', presentingStateOf(hackathonId, presentedSeeds, userProfileId))
}

const setPresentingGroup = async (socket, groupNumber) => {
  const hackathonId = joinedHackathonIdOf(socket)
  checkIsStaff(socket)
  checkIsGroupOf(await getHackathonExploringGroups(hackathonId), groupNumber)
  const groupPresentation = groupPresentationOf(hackathonId)
  groupPresentation.presentedGroupNumbers.push(groupPresentation.presentingGroupNumber)
  groupPresentation.presentingGroupNumber = groupNumber
  socket.to(participantsRoomOf(hackathonId)).emit('new_presenting_group', groupNumber)
}

const enableRatingsSubmission = async (socket) => {
  const hackathonId = joinedHackathonIdOf(socket)
  checkIsStaff(socket)
  const groupPresentation = groupPresentationOf(hackathonId)
  if (groupPresentation.submissionEnabled) return
  const groups = await getHackathonExploringGroups(hackathonId)
  groupPresentation.submissionEnabled = true
  groupPresentation.presentedGroupNumbers = groups.map((group) => group.number)
  socket.to(participantsRoomOf(hackathonId)).emit('ratings_submission_enabled')
  const presentedSeeds = await presentedSeedsOf(socket, hackathonId)
  socket.to(participantsRoomOf(hackathonId)).emit('group_presenting_state', presentingStateOf(hackathonId, presentedSeeds))
}

const submitRatings = async (socket, submittedRatings) => {
  const hackathonId = joinedHackathonIdOf(socket)
  checkIsParticipant(socket)
  const groupPresentation = groupPresentationOf(hackathonId)
  errorThrower(!groupPresentation.submissionEnabled, 'Ratings are not open yet', 409)
  const userProfileId = userProfileIdOf(socket)
  errorThrower(!!groupPresentation.participantRatings[userProfileId], 'Your ratings were already submitted', 409)
  checkIsRatingList(submittedRatings)
  checkRatesEveryGroupSeed(submittedRatings, await getHackathonExploringGroups(hackathonId))
  groupPresentation.participantRatings[userProfileId] = submittedRatings
  socket.to(managementRoomOf(hackathonId)).emit('ratings', groupPresentation.participantRatings)
}

const sendRatings = (socket) => {
  const hackathonId = joinedHackathonIdOf(socket)
  checkIsManagement(socket)
  socket.emit('ratings', groupPresentationOf(hackathonId).participantRatings)
}

export function onConnectGroupPresentations (socket) {
  onEvent(socket, 'get_group_presenting_state', () => sendPresentingState(socket))
  onEvent(socket, 'submit_ratings', (submittedRatings) => submitRatings(socket, submittedRatings))
  onEvent(socket, 'set_presenting_group', (groupNumber) => setPresentingGroup(socket, groupNumber))
  onEvent(socket, 'enable_ratings_submission', () => enableRatingsSubmission(socket))
  onEvent(socket, 'get_ratings', () => sendRatings(socket))
}
