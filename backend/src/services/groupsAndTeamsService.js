import { Participation } from '../models/Participation.js'
import { checkExists } from '../validators/generalValidators.js'
import { checkUserIsGroupVoice, checkUserIsInHackathon } from '../validators/userHackathonValidators.js'
import { errorThrower } from './errorThrower.js'
import { includeParticipationItems } from './includes/participationIncludes.js'
import { mapGroupMember } from './mappers/participationMapper.js'
import { getMembers } from './userHackathonsService.js'
import * as HackathonsRepository from '../repositories/hackathonsRepository.js'
import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'

export async function getClusterExploringGroups (hackathonId, clusterNumber) {
  const hackathon = await HackathonsRepository.getHackathonById(null, hackathonId, false)
  if (!checkExists(hackathon)) return []
  if (hackathon.phase === 'GROUP_CREATION') {
    return await GroupsAndTeamsRepository.getConceptualMapsOfHackathon(hackathonId)
  }
  return await getClusterExploringGroupsAfterCreation(hackathonId, clusterNumber)
}

export async function getClusterExploringGroupsAfterCreation (hackathonId, clusterNumber) {
  const allGroupsMembers = await Participation.scope({
    method: ['inHackathon', { hackathonId, clusterNumber }]
  }).findAll()

  const groupIds = [...new Set(allGroupsMembers.map(m => m.groupId))].sort()
  const groups = []

  for (const groupId of groupIds) {
    groups.push({
      id: groupId,
      members: allGroupsMembers.filter(m => m.groupId === groupId).map(m => mapGroupMember(m)),
      number: groups.length + 1
    })
  }

  return groups
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

const updateConceptualMap = async (conceptualMapId, map) => {
  const mapToUpdate = await GroupsAndTeamsRepository.getConceptualMap(conceptualMapId)
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
  return {
    ...updatedParticipation.toJSON(),
    ...(await getMembers(updatedParticipation))
  }
}

export async function getConceptualMap (userId, groupId) {
  const conceptualMap = await GroupsAndTeamsRepository.test3(groupId)
  errorThrower(!checkExists(conceptualMap), 'Map not found', 404)

  if (conceptualMap.isDelivered) {
    return conceptualMap
  }

  const hackathonId = (await Participation.findOne({
    attributes: ['hackathonId'],
    where: {
      groupId
    }
  }))?.hackathonId
  errorThrower(!checkExists(hackathonId), 'Group not found', 404)

  await checkUserIsInHackathon(userId, hackathonId)

  return conceptualMap
}
