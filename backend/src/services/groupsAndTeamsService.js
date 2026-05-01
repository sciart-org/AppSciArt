import { checkExists } from '../validators/generalValidators.js'
import { checkUserIsGroupVoice, checkUserIsInHackathon } from '../validators/userHackathonValidators.js'
import { errorThrower } from './errorThrower.js'
import { mapGroupMember } from './mappers/participationMapper.js'
import * as HackathonsRepository from '../repositories/hackathonsRepository.js'
import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'
import * as ProductsRepository from '../repositories/productsRepository.js'
import * as SeedsService from '../services/seedsService.js'
import { checkIsStaff } from '../validators/userValidators.js'

export async function getHackathonExploringGroups (hackathonId) {
  const hackathon = await HackathonsRepository.getHackathonById(null, hackathonId, false)
  if (!checkExists(hackathon)) return []
  if (hackathon.phase === 'GROUP_CREATION') {
    return await GroupsAndTeamsRepository.getConceptualMapsOfHackathon(hackathonId)
  }
  return await getHackathonExploringGroupsAfterCreation(hackathonId)
}

async function getHackathonExploringGroupsAfterCreation (hackathonId) {
  const conceptualMaps = await GroupsAndTeamsRepository.getConceptualMapsOfHackathonWithParticipants(hackathonId)

  return conceptualMaps.map((map, index) => ({
    id: map.id,
    members: map.participations.map(m => mapGroupMember(m)),
    number: index + 1,
    seedId: map.seedId ?? null,
    seedTitle: map.seed?.title ?? null,
    isDelivered: map.isDelivered
  }))
}

export async function createExploringGroup (userId, hackathonId, seedId) {
  errorThrower(!(await checkIsStaff(userId)), 'Unauthorized: You cannot create exploring groups', 403)
  const existingGroup = await GroupsAndTeamsRepository.getConceptualMapOfSeedInHackathon(seedId, hackathonId)
  errorThrower(checkExists(existingGroup), 'A group already exists for this seed', 409)
  const seedsOfHackathon = await ProductsRepository.getSeedsOfHackathon(hackathonId)
  errorThrower(!seedsOfHackathon.map(s => s.id).includes(seedId), 'The seed does not belong to this hackathon', 400)
  return await GroupsAndTeamsRepository.createConceptualMapOfSeed(seedId)
}

export async function getExploringGroupDetails (groupId) {
  if (!groupId) return null

  const conceptualMap = await GroupsAndTeamsRepository.getConceptualMapWithParticipants(groupId)
  if (!conceptualMap) return null

  const { hackathonId } = conceptualMap.participations[0]

  const allMaps = await GroupsAndTeamsRepository.getConceptualMapsOfHackathonWithParticipants(hackathonId)
  const number = allMaps.findIndex(m => m.id === groupId) + 1

  return {
    id: groupId,
    members: conceptualMap.participations.map(m => mapGroupMember(m)),
    number,
    seedId: conceptualMap.seedId ?? null
  }
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

export async function submitConceptualMap (userId, groupId, map) {
  const userParticipation = await checkUserIsGroupVoice(userId, groupId)

  const mapToUpdate = await GroupsAndTeamsRepository.getConceptualMap(groupId)
  errorThrower(!checkExists(mapToUpdate), 'Group not found', 404)
  errorThrower(mapToUpdate.isDelivered, 'Conceptual map already delivered', 409)
  mapToUpdate.map = map
  mapToUpdate.isDelivered = true
  await mapToUpdate.save()

  return userParticipation.id
}

export async function getConceptualMap (userId, groupId) {
  const conceptualMap = await GroupsAndTeamsRepository.getConceptualMapWithSeeds(groupId)
  errorThrower(!checkExists(conceptualMap), 'Map not found', 404)

  if (conceptualMap.isDelivered) {
    return conceptualMap
  }

  const hackathonId = (await ProductsRepository.getMinimalParticipationInHackathon(
    { groupId }
  ))?.hackathonId

  errorThrower(!checkExists(hackathonId), 'Group not found', 404)

  await checkUserIsInHackathon(userId, hackathonId)

  return conceptualMap
}

export const deleteUnassignedConceptualMapsOfHackathon = async (hackathonId) => {
  const participations = await ProductsRepository.getMinimalParticipationsOfHackathon({ hackathonId })

  const associatedGroupIds = participations.map(p => p.groupId)
  const mapsInHackathon = await GroupsAndTeamsRepository.getConceptualMapsOfHackathon(hackathonId)
  const mapIdsInHackathon = mapsInHackathon.map(m => m.id)
  if (!mapIdsInHackathon.length) return 0

  const unassignedIds = mapsInHackathon
    .map(m => m.id)
    .filter(id => !associatedGroupIds.includes(id))

  return Promise.all(unassignedIds.map(GroupsAndTeamsRepository.deleteConceptualMap))
}

export const createConceptualMapsOfHackathon = async (hackathonId) => {
  const hackathonSeeds = await SeedsService.getSeedsByHackathon(null, hackathonId)
  return Promise.all(hackathonSeeds.map((seed) => GroupsAndTeamsRepository.createConceptualMapOfSeed(seed?.id)))
}
