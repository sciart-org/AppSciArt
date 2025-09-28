import { ConceptualMap } from '../models/ConceptualMap.js'
import { Participation } from '../models/Participation.js'
import { checkExists } from '../validators/generalValidators.js'
import { errorThrower } from './errorThrower.js'
import { includeParticipationItems } from './includes/participationIncludes.js'
import { mapHackathonParticipation } from './mappers/hackathonMapper.js'
import { getMembers } from './userHackathonsService.js'

export function getClusterExploringGroups (req, res) {
  res.send({
    message: 'This is the mockup controller for getClusterExploringGroups'
  })
}

export function createExploringGroup (req, res) {
  res.send({
    message: 'This is the mockup controller for createExploringGroup'
  })
}

export function getExploringGroupDetails (req, res) {
  res.send({
    message: 'This is the mockup controller for getExploringGroupDetails'
  })
}

export function deleteExploringGroup (req, res) {
  res.send({
    message: 'This is the mockup controller for deleteExploringGroup'
  })
}

export function updateExploringGroup (req, res) {
  res.send({
    message: 'This is the mockup controller for updateExploringGroup'
  })
}

export function getClusterCoCreationTeams (req, res) {
  res.send({
    message: 'This is the mockup controller for getClusterCoCreationTeams'
  })
}

export function createCoCreationTeam (req, res) {
  res.send({
    message: 'This is the mockup controller for createCoCreationTeam'
  })
}

export function getCoCreationTeamDetails (req, res) {
  res.send({
    message: 'This is the mockup controller for getCoCreationTeamDetails'
  })
}

export function deleteCoCreationTeam (req, res) {
  res.send({
    message: 'This is the mockup controller for deleteCoCreationTeam'
  })
}

export function updateCoCreationTeam (req, res) {
  res.send({
    message: 'This is the mockup controller for updateCoCreationTeam'
  })
}

const checkUserIsGroupVoice = async (userId, groupId) => {
  const participation = await Participation.findOne({
    where: {
      userProfileId: userId,
      groupId,
      isGroupVoice: true
    }
  })
  errorThrower(!checkExists(participation), 'Only the group voice can submit the conceptual map', 403)
  return participation
}

const updateConceptualMap = async (conceptualMapId, map) => {
  const mapToUpdate = await ConceptualMap.findByPk(conceptualMapId)
  errorThrower(!checkExists(mapToUpdate), 'Group not found', 404)
  errorThrower(mapToUpdate.isDelivered, 'Conceptual map already delivered', 409)
  mapToUpdate.map = map
  mapToUpdate.isDelivered = true
  await mapToUpdate.save()
}

export async function submitConceptualMap (userId, groupId, map) {
  const userParticipation = await checkUserIsGroupVoice(userId, groupId)
  await updateConceptualMap(groupId, map)
  const updatedParticipation = await Participation.findByPk(userParticipation.id, {
    include: includeParticipationItems()
  })
  return mapHackathonParticipation({
    ...updatedParticipation.toJSON(),
    ...(await getMembers(updatedParticipation))
  })
}
