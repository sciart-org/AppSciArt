import { checkExists } from '../validators/generalValidators.js'
import { validateParticipantExists } from '../validators/hackathonValidators.js'
import { validateConceptualMapIsFromHackathon, validateFlowerIsFromHackathon, validateFruitIsFromHackathon } from '../validators/productValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { errorThrower } from './errorThrower.js'
import { mapGroupMember, mapTeamMember } from './mappers/participationMapper.js'
import * as ProductsRepository from '../repositories/productsRepository.js'
import * as UsersRepository from '../repositories/usersRepository.js'
import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'

export function getUserEnrolledHackathons (req, res) {
  res.send({
    message: 'This is the mockup controller for getUserEnrolledHackathons'
  })
}

export async function joinHackathon (userId, hackathonId, roles, interests) {
  const user = await UsersRepository.getUserProfileById(userId)
  errorThrower(!checkExists(user), 'User not found.', 404)

  return await ProductsRepository.createParticipation({
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
    const members = await ProductsRepository.getParticipationsOfHackathon({
      hackathonId: participation.hackathonId,
      clusterNumber: participation.clusterNumber,
      groupId: participation.groupId
    })
    groupMembers = members.map(mapGroupMember)
  }

  if (checkExists(participation.teamId) || checkExists(participation.fruitId)) {
    const teamSearchCondition = checkExists(participation.fruitId) ? { fruitId: participation.fruitId } : { teamId: participation.teamId }
    const members = await ProductsRepository.getParticipationsOfHackathon({
      hackathonId: participation.hackathonId,
      clusterNumber: participation.clusterNumber,
      ...teamSearchCondition
    })
    teamMembers = members.map(mapTeamMember)
  }

  return { groupMembers, teamMembers }
}

export async function getParticipationById (userId, participationId) {
  const user = await UsersRepository.getUserProfileById(userId)
  errorThrower(!checkExists(user), 'User not found.', 404)

  const participation = await ProductsRepository.getParticipationById(participationId)

  errorThrower(!(participation.user_profile.id === userId || await checkIsStaff(userId)), 'Unauthorized: You cannot access this participation', 403)

  const members = await getMembers(participation)

  return {
    ...participation.toJSON(),
    ...members
  }
}

export async function getParticipation (userId, hackathonId) {
  const participation = await validateParticipantExists(userId, hackathonId)
  return await getParticipationById(userId, participation.id)
}

export async function updateParticipationById (currentUserId, participationId, body) {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot edit participations', 403)
  const participation = await ProductsRepository.getMinimalParticipation(participationId)
  return await updateParticipation(currentUserId, participation, body)
}

async function updateParticipation (currentUserId, participation, body) {
  const { clusterNumber, roles, interests, isGroupVoice, isTeamSpeaker, hasConfirmedAssistance, groupId, teamId, fruitId } = body
  const participationBody = { clusterNumber, roles, interests, isGroupVoice, isTeamSpeaker, hasConfirmedAssistance, groupId, teamId, fruitId }
  const previousGroupId = participation.groupId

  if (groupId) await validateConceptualMapIsFromHackathon(groupId, participation.hackathonId)
  if (teamId) await validateFlowerIsFromHackathon(teamId, participation.hackathonId)
  if (fruitId) await validateFruitIsFromHackathon(fruitId, participation.hackathonId)
  if (isGroupVoice) {
    const group = await GroupsAndTeamsRepository.getConceptualMapWithParticipants(previousGroupId)
    const otherIds = group.participations.map(p => p.id).filter(id => id !== participation.id)
    await Promise.all(otherIds.map(async id => await ProductsRepository.updateParticipationById(id, { isGroupVoice: false })))
  }

  const previousGroup = previousGroupId && groupId === null
    ? await GroupsAndTeamsRepository.getConceptualMapWithParticipants(previousGroupId)
    : null

  if (Object.values(participationBody).some(v => v !== undefined)) {
    await ProductsRepository.updateParticipationById(participation.id, participationBody)
  }

  if (previousGroup?.participations.length === 1) {
    await GroupsAndTeamsRepository.deleteConceptualMap(previousGroupId)
  }

  return getParticipationById(currentUserId, participation.id)
}

export async function updateParticipationByUserAndHackathon (currentUserId, userId, hackathonId, body) {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot edit participations', 403)
  const participation = await validateParticipantExists(userId, hackathonId)
  return await updateParticipation(currentUserId, participation, body)
}
