import { checkExists } from '../validators/generalValidators.js'
import { validateParticipantExists } from '../validators/hackathonValidators.js'
import { validateConceptualMapIsFromHackathon, validateFlowerIsFromHackathon, validateFruitIsFromHackathon } from '../validators/productValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { errorThrower } from './errorThrower.js'
import { mapGroupMember, mapTeamMember } from './mappers/participationMapper.js'
import * as ProductsRepository from '../repositories/productsRepository.js'
import * as UsersRepository from '../repositories/usersRepository.js'
import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'
import * as HackathonsRepository from '../repositories/hackathonsRepository.js'
import { emitGroupRemovedToStaff } from '../sockets/hackathonPhases.js'

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

const checkMovingGroupVoice = async (currentUserId, hackathonId, participation, previousGroupId) => {
  if (!participation.isGroupVoice || previousGroupId === null) {
    return
  }
  const group = await GroupsAndTeamsRepository.getConceptualMapWithParticipants(previousGroupId)
  if (group.participations.length === 1) {
    return
  }
  const hackathon = await HackathonsRepository.getHackathonById(currentUserId, hackathonId, true)
  errorThrower(hackathon.phase !== 'GROUP_CREATION' && participation.isGroupVoice, 'You cannot move the group voice. Please assign a new group voice before moving the participant.', 400)
}

const checkMovingTeamSpeaker = async (currentUserId, hackathonId, participation, previousTeamId) => {
  if (!participation.isTeamSpeaker || previousTeamId === null) {
    return
  }
  /*
  TODO
  */
  const hackathon = await HackathonsRepository.getHackathonById(currentUserId, hackathonId, true)
  errorThrower(hackathon.phase !== 'TEAM_CREATION' && participation.isGroupVoice, 'You cannot move the team speaker. Please assign a new team speaker before moving the participant.', 400)
}

const setRestOfGroupVoiceToFalse = async (groupId, participationId) => {
  const group = await GroupsAndTeamsRepository.getConceptualMapWithParticipants(groupId)
  const otherIds = group.participations.map(p => p.id).filter(id => id !== participationId)
  await Promise.all(otherIds.map(async id => await ProductsRepository.updateParticipationById(id, { isGroupVoice: false })))
}

const setRestOfTeamSpeakersToFalse = async (teamId, participationId) => {
  /*
  TODO
  */
}

const checkIsRemovingGroupVoiceOfCreatedGroup = async (currentUserId, hackathonId) => {
  const hackathon = await HackathonsRepository.getHackathonById(currentUserId, hackathonId, true)
  errorThrower(hackathon.phase !== 'GROUP_CREATION', 'You must assign a new group voice.', 400)
}

const checkIsRemovingTeamSpeakerOfCreatedTeam = async (currentUserId, hackathonId) => {
  const hackathon = await HackathonsRepository.getHackathonById(currentUserId, hackathonId, true)
  errorThrower(hackathon.phase !== 'TEAM_CREATION', 'You must assign a new team speaker.', 400)
}

const validateGroupIsValid = async (currentUserId, participation, body) => {
  let { isGroupVoice, groupId } = body

  const previousGroupId = participation.groupId
  const hackathonId = participation.hackathonId

  if (groupId !== undefined) {
    await checkMovingGroupVoice(currentUserId, hackathonId, participation, previousGroupId)
    isGroupVoice = false
  }

  if (groupId) { await validateConceptualMapIsFromHackathon(groupId, hackathonId) }

  if (isGroupVoice) {
    errorThrower(previousGroupId === null, 'A group voice must be assigned to a group.', 400)
    await setRestOfGroupVoiceToFalse(previousGroupId, participation.id)
  }
  if (isGroupVoice === false && groupId === undefined) {
    await checkIsRemovingGroupVoiceOfCreatedGroup(currentUserId, hackathonId)
  }
}

const validateTeamIsValid = async (currentUserId, participation, body) => {
  let { isTeamSpeaker, teamId } = body

  const previousTeamId = participation.teamId
  const hackathonId = participation.hackathonId

  if (teamId !== undefined) {
    await checkMovingTeamSpeaker(currentUserId, hackathonId, participation, previousTeamId)
    isTeamSpeaker = false
  }

  if (teamId) await validateFlowerIsFromHackathon(teamId, hackathonId)

  if (isTeamSpeaker) {
    errorThrower(previousTeamId === null, 'A team speaker must be assigned to a team.', 400)
    await setRestOfTeamSpeakersToFalse(previousTeamId, participation.id)
  }
  if (isTeamSpeaker === false && teamId === undefined) {
    await checkIsRemovingTeamSpeakerOfCreatedTeam(currentUserId, hackathonId)
  }
}

const validateCanUpdateParticipation = async (currentUserId, participation, body) => {
  const { fruitId } = body
  const hackathonId = participation.hackathonId

  await validateGroupIsValid(currentUserId, participation, body)
  await validateTeamIsValid(currentUserId, participation, body)

  if (fruitId) await validateFruitIsFromHackathon(fruitId, hackathonId)
}

const removeGroupIfEmpty = async (groupId, hackathonId) => {
  const group = await GroupsAndTeamsRepository.getConceptualMapWithParticipants(groupId)

  if (group?.participations.length === 1) {
    await GroupsAndTeamsRepository.deleteConceptualMap(groupId)
    emitGroupRemovedToStaff(hackathonId, groupId)
  }
}

async function updateParticipation (currentUserId, participation, body) {
  const previousGroupId = participation.groupId
  const hackathonId = participation.hackathonId

  await validateCanUpdateParticipation(currentUserId, participation, body)

  const { clusterNumber, roles, interests, isGroupVoice, isTeamSpeaker, hasConfirmedAssistance, groupId, teamId, fruitId } = body
  const participationBody = { clusterNumber, roles, interests, isGroupVoice, isTeamSpeaker, hasConfirmedAssistance, groupId, teamId, fruitId }

  if (groupId === null) {
    await removeGroupIfEmpty(previousGroupId, hackathonId)
  }

  if (Object.values(participationBody).some(v => v !== undefined)) {
    await ProductsRepository.updateParticipationById(participation.id, participationBody)
  }

  return getParticipationById(currentUserId, participation.id)
}

export async function updateParticipationByUserAndHackathon (currentUserId, userId, hackathonId, body) {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot edit participations', 403)
  const participation = await validateParticipantExists(userId, hackathonId)
  return await updateParticipation(currentUserId, participation, body)
}
