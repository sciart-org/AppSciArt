import { Participation } from '../models/Participation.js'
import { checkExists } from '../validators/generalValidators.js'
import { validateParticipantExists } from '../validators/hackathonValidators.js'
import { validateConceptualMapIsFromHackathon, validateFlowerIsFromHackathon, validateFruitIsFromHackathon } from '../validators/productValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { errorThrower } from './errorThrower.js'
import { mapGroupMember, mapTeamMember } from './mappers/participationMapper.js'
import * as ProductsRepository from '../repositories/productsRepository.js'
import * as UsersRepository from '../repositories/usersRepository.js'

export function getUserEnrolledHackathons (req, res) {
  res.send({
    message: 'This is the mockup controller for getUserEnrolledHackathons'
  })
}

export async function joinHackathon (userId, hackathonId, roles, interests) {
  const user = await UsersRepository.getUserProfileById(userId)
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
    const members = await Participation.scope({
      method: ['inHackathon', {
        hackathonId: participation.hackathonId,
        clusterNumber: participation.clusterNumber,
        groupId: participation.groupId
      }]
    }).findAll()
    groupMembers = members.map(mapGroupMember)
  }

  if (checkExists(participation.teamId) || checkExists(participation.fruitId)) {
    const teamSearchCondition = checkExists(participation.fruitId) ? { fruitId: participation.fruitId } : { teamId: participation.teamId }
    const members = await Participation.scope({
      method: ['inHackathon', {
        hackathonId: participation.hackathonId,
        clusterNumber: participation.clusterNumber,
        ...teamSearchCondition
      }]
    }).findAll()
    teamMembers = members.map(mapTeamMember)
  }

  return { groupMembers, teamMembers }
}

export async function getParticipationById (userId, participationId) {
  const user = await UsersRepository.getUserProfileById(userId)
  errorThrower(!checkExists(user), 'User not found.', 404)

  const participation = await ProductsRepository.getParticipationById(participationId)

  errorThrower(!(participation.userProfile.id === userId || await checkIsStaff(userId)), 'Unauthorized: You cannot access this participation', 403)

  const members = await getMembers(participation)

  return {
    ...participation.toJSON(),
    ...members
  }
}

export async function getParticipation (userId, hackathonId) {
  const participation = await validateParticipantExists(userId, hackathonId)
  return await getParticipationById(participation.id)
}

export async function updateParticipation (currentUserId, userId, hackathonId, body) {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot edit participations', 403)
  const participation = await validateParticipantExists(userId, hackathonId)

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
    await Participation.update(participationBody, { where: { id: participation.id } })
  }

  return await getParticipationById(participation.id)
}
