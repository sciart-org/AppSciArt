import { Participation } from '../models/Participation.js'
import { UserProfile } from '../models/UserProfile.js'
import { checkExists } from '../validators/generalValidators.js'
import { validateParticipantExists } from '../validators/hackathonValidators.js'
import { validateConceptualMapIsFromHackathon, validateFlowerIsFromHackathon, validateFruitIsFromHackathon } from '../validators/productValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { errorThrower } from './errorThrower.js'
import { includeParticipationItems, searchParticipantsOf } from './includes/participationIncludes.js'
import { mapHackathonParticipation } from './mappers/hackathonMapper.js'
import { mapGroupMember, mapTeamMember } from './mappers/participationMapper.js'

export function getUserEnrolledHackathons (req, res) {
  res.send({
    message: 'This is the mockup controller for getUserEnrolledHackathons'
  })
}

export async function joinHackathon (userId, hackathonId, roles, interests) {
  const user = await UserProfile.findByPk(userId)
  errorThrower(!checkExists(user), 'User not found.', 404)

  return await Participation.create({
    userProfileId: userId,
    hackathonId,
    roles,
    interests
  })
}

export function getUserHackathonContributions (req, res) {
  res.send({
    message: 'This is the mockup controller for getUserHackathonContributions'
  })
}

export function joinCluster (req, res) {
  res.send({
    message: 'This is the mockup controller for joinCluster'
  })
}

export const getMembers = async (participation) => {
  let groupMembers = []
  let teamMembers = []

  if (checkExists(participation.groupId)) {
    groupMembers = await Participation.findAll(searchParticipantsOf({
      hackathonId: participation.hackathonId,
      clusterNumber: participation.clusterNumber,
      groupId: participation.groupId
    }))
    groupMembers = groupMembers.map(m => mapGroupMember(m))
  }

  if (checkExists(participation.teamId) || checkExists(participation.fruitId)) {
    const teamSearchCondition = checkExists(participation.fruitId) ? { fruitId: participation.fruitId } : { teamId: participation.teamId }
    teamMembers = await Participation.findAll(searchParticipantsOf({
      hackathonId: participation.hackathonId,
      clusterNumber: participation.clusterNumber,
      ...teamSearchCondition
    }))
    teamMembers = teamMembers.map(m => mapTeamMember(m))
  }

  return {
    groupMembers,
    teamMembers
  }
}

async function getParticipationById (participationId) {
  const participation = await Participation.findByPk(participationId, {
    attributes: {
      exclude: ['interests', 'roles', 'userProfileId']
    },
    include: includeParticipationItems()
  })

  const members = await getMembers(participation)

  return mapHackathonParticipation({
    ...participation.toJSON(),
    ...members
  })
}

export async function getParticipation (userId, hackathonId) {
  const user = await UserProfile.findByPk(userId)
  errorThrower(!checkExists(user), 'User not found.', 404)

  const participationId = await validateParticipantExists(userId, hackathonId)
  return await getParticipationById(participationId)
}

export async function updateParticipation (currentUserId, userId, hackathonId, body) {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot edit participations', 403)
  const participationId = await validateParticipantExists(userId, hackathonId)

  const { clusterNumber, roles, interests, isGroupVoice, isTeamSpeaker, hasConfirmedAssistance, groupId, teamId, fruitId } = body
  const participationBody = { clusterNumber, roles, interests, isGroupVoice, isTeamSpeaker, hasConfirmedAssistance, groupId, teamId, fruitId }

  if (groupId) {
    await validateConceptualMapIsFromHackathon(groupId, hackathonId)
  }

  if (teamId) {
    await validateFlowerIsFromHackathon(teamId, hackathonId)
  }

  if (fruitId) {
    await validateFruitIsFromHackathon(fruitId, hackathonId)
  }

  if (Object.values(participationBody).some(v => v !== undefined)) {
    await Participation.update(participationBody, { where: { id: participationId } })
  }

  return await getParticipationById(participationId)
}
