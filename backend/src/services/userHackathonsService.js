import { checkExists } from '../validators/generalValidators.js'
import { validateParticipantExists } from '../validators/hackathonValidators.js'
import { validateConceptualMapIsFromHackathon, validateFlowerIsFromHackathon, validateFruitIsFromHackathon } from '../validators/productValidators.js'
import { checkHasRole, checkIsStaff } from '../validators/userValidators.js'
import { errorThrower } from './errorThrower.js'
import { mapGroupMember, mapTeamMember } from './mappers/participationMapper.js'
import * as ParticipationsRepository from '../repositories/participationsRepository.js'
import * as UsersRepository from '../repositories/usersRepository.js'
import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'
import * as HackathonsRepository from '../repositories/hackathonsRepository.js'
import { emitGroupRemovedToStaff, emitGroupUpdateToStaff, emitTeamUpdateToStaff } from '../sockets/hackathonPhases.js'
import * as FlowersRepository from '../repositories/flowersRepository.js'
import { getFlowerRubrics, getFlowersWithTemplate } from './driveService.js'
import { toPlainObject } from './mappers/utils.js'
import { ROLES } from './Roles.js'

export function getUserEnrolledHackathons (req, res) {
  res.send({
    message: 'This is the mockup controller for getUserEnrolledHackathons'
  })
}

export async function joinHackathon (userId, hackathonId, roles, interests) {
  const user = await UsersRepository.getUserProfileById(userId)
  errorThrower(!checkExists(user), 'User not found.', 404)

  return await ParticipationsRepository.createParticipation({
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
    const members = await ParticipationsRepository.getParticipationsOfHackathon({
      hackathonId: participation.hackathonId,
      clusterNumber: participation.clusterNumber,
      groupId: participation.groupId
    })
    groupMembers = members.map(mapGroupMember)
  }

  if (checkExists(participation.teamId) || checkExists(participation.fruitId)) {
    const teamSearchCondition = checkExists(participation.fruitId) ? { fruitId: participation.fruitId } : { teamId: participation.teamId }
    const members = await ParticipationsRepository.getParticipationsOfHackathon({
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

  const participation = await ParticipationsRepository.getParticipationById(participationId, true)

  errorThrower(!(participation.user_profile.id === userId || await checkIsStaff(userId)), 'Unauthorized: You cannot access this participation', 403)

  const members = await getMembers(participation)
  const plainParticipation = toPlainObject(participation)

  let flowerWithTemplate
  if (plainParticipation.teamFlower?.id) {
    [flowerWithTemplate] = await getFlowersWithTemplate([plainParticipation.teamFlower])
  }

  return {
    ...plainParticipation,
    teamFlower: flowerWithTemplate ?? null,
    ...members
  }
}

export async function getParticipation (userId, hackathonId) {
  const participation = await validateParticipantExists(userId, hackathonId)
  return await getParticipationById(userId, participation.id)
}

export async function getEvaluatorDetails (user, hackathonId) {
  const isEvaluator = await checkHasRole(user.id, ROLES.EVALUATOR, { hackathonId })
  if (!isEvaluator) return { isEvaluator }

  const hackathonFlowers = await FlowersRepository.getFlowersOfHackathon(hackathonId, true)
  const flowers = hackathonFlowers
    ? await getFlowerRubrics(`${user.name} ${user.surname}`, hackathonFlowers)
    : undefined

  return { isEvaluator, flowers }
}

export async function getHackathonEvaluators (hackathonId) {
  const evaluators = await HackathonsRepository.getEvaluatorsOfHackathon(hackathonId)
  return evaluators
}

export async function updateParticipationById (currentUserId, participationId, body) {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot edit participations', 403)
  const participation = await ParticipationsRepository.getMinimalParticipation(participationId)
  return await updateParticipation(currentUserId, participation, body)
}

const checkMovingGroupVoice = async (hackathonState, participation, previousGroupId) => {
  if (!participation.isGroupVoice || previousGroupId === null) {
    return
  }
  const group = await GroupsAndTeamsRepository.getConceptualMapWithParticipants(previousGroupId)
  if (group.participations.length === 1) {
    return
  }
  errorThrower(hackathonState !== 'GROUP_CREATION' && participation.isGroupVoice, 'You cannot move the group voice. Please assign a new group voice before moving the participant.', 400)
}

const checkMovingTeamSpeaker = async (hackathonState, participation, previousTeamId) => {
  if (!participation.isTeamSpeaker || previousTeamId === null) {
    return
  }
  const teamFlower = await FlowersRepository.getFlowerWithSeedById(previousTeamId, true)
  if (teamFlower.participations.length === 1) {
    return
  }
  errorThrower(hackathonState !== 'TEAM_CREATION' && participation.isTeamSpeaker, 'You cannot move the team speaker. Please assign a new team speaker before moving the participant.', 400)
}

const setRestOfGroupVoiceToFalse = async (groupId, participationId) => {
  const group = await GroupsAndTeamsRepository.getConceptualMapWithParticipants(groupId)
  const otherIds = group.participations.map(p => p.id).filter(id => id !== participationId)
  await Promise.all(otherIds.map(async id => await ParticipationsRepository.updateParticipationById(id, { isGroupVoice: false })))
}

const setRestOfTeamSpeakersToFalse = async (teamId, participationId) => {
  const participations = await ParticipationsRepository.getMinimalParticipationsOfHackathon({ teamId })
  const otherIds = participations.map(p => p.id).filter(id => id !== participationId)
  await Promise.all(otherIds.map(id =>
    ParticipationsRepository.updateParticipationById(id, { isTeamSpeaker: false })
  ))
}

const validateGroupIsValid = async (hackathonState, participation, body) => {
  const previousGroupId = participation.groupId
  const hackathonId = participation.hackathonId

  if (body.groupId !== undefined) {
    await checkMovingGroupVoice(hackathonState, participation, previousGroupId)
    body.isGroupVoice = false
  }

  if (body.groupId) {
    await validateConceptualMapIsFromHackathon(body.groupId, hackathonId)
    emitGroupUpdateToStaff(hackathonId, null, {})
  }

  if (body.isGroupVoice) {
    errorThrower(previousGroupId === null, 'A group voice must be assigned to a group.', 400)
    await setRestOfGroupVoiceToFalse(previousGroupId, participation.id)
  }
  if (body.isGroupVoice === false && body.groupId === undefined) {
    errorThrower(hackathonState !== 'GROUP_CREATION', 'You must assign a new group voice.', 400)
  }
}

const validateTeamIsValid = async (hackathonState, participation, body) => {
  const previousTeamId = participation.teamId
  const hackathonId = participation.hackathonId

  if (body.teamId !== undefined) {
    await checkMovingTeamSpeaker(hackathonState, participation, previousTeamId)
    body.isTeamSpeaker = false
  }

  if (body.teamId) {
    await validateFlowerIsFromHackathon(body.teamId, hackathonId)
    emitTeamUpdateToStaff(hackathonId, null, {})
  }

  if (body.isTeamSpeaker) {
    errorThrower(previousTeamId === null, 'A team speaker must be assigned to a team.', 400)
    await setRestOfTeamSpeakersToFalse(previousTeamId, participation.id)
  }

  if (body.isTeamSpeaker === false && body.teamId === undefined) {
    errorThrower(hackathonState !== 'TEAM_CREATION', 'You must assign a new team speaker.', 400)
  }
}

const validateCanUpdateParticipation = async (hackathonPhase, participation, body) => {
  const { fruitId } = body
  const hackathonId = participation.hackathonId

  await validateGroupIsValid(hackathonPhase, participation, body)
  await validateTeamIsValid(hackathonPhase, participation, body)

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
  const hackathon = await HackathonsRepository.getHackathonById(currentUserId, hackathonId)
  const hackathonPhase = hackathon.phase

  await validateCanUpdateParticipation(hackathonPhase, participation, body)

  const { clusterNumber, roles, interests, isGroupVoice, isTeamSpeaker, hasConfirmedAssistance, groupId, teamId, fruitId } = body
  const participationBody = { clusterNumber, roles, interests, isGroupVoice, isTeamSpeaker, hasConfirmedAssistance, groupId, teamId, fruitId }

  if (groupId === null && hackathonPhase !== 'GROUP_CREATION') {
    await removeGroupIfEmpty(previousGroupId, hackathonId)
  }

  if (Object.values(participationBody).some(v => v !== undefined)) {
    await ParticipationsRepository.updateParticipationById(participation.id, participationBody)
  }

  return getParticipationById(currentUserId, participation.id)
}

export async function updateParticipationByUserAndHackathon (currentUserId, userId, hackathonId, body) {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot edit participations', 403)
  const participation = await validateParticipantExists(userId, hackathonId)
  return await updateParticipation(currentUserId, participation, body)
}
