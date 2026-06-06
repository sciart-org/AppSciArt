import { checkExists } from '../validators/generalValidators.js'
import { checkUserIsGroupVoice, checkUserIsInHackathon, checkUserIsTeamSpeaker } from '../validators/userHackathonValidators.js'
import { errorThrower } from './errorThrower.js'
import { mapGroupMember, mapTeamMember } from './mappers/participationMapper.js'
import * as HackathonsRepository from '../repositories/hackathonsRepository.js'
import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'
import * as ParticipationsRepository from '../repositories/participationsRepository.js'
import * as SeedsRepository from '../repositories/seedsRepository.js'
import * as SeedsService from '../services/seedsService.js'
import * as FlowersRepository from '../repositories/flowersRepository.js'
import { INTERNAL_BACKEND_ROLE, ROLES } from './Roles.js'

const defaultConceptualMap = {
  nodes: [
    { id: 'n0', position: { x: 0, y: 0 }, data: { label: 'ASTER+S' }, type: 'text' }
  ],
  edges: []
}

const buildCoCreationTeam = (flower, teamNumber) => {
  const isDelivered = flower?.state === 'IN_REVIEW' || flower?.state === 'PUBLISHED'

  return {
    id: flower.id,
    members: flower.participations.map(m => mapTeamMember(m)),
    number: teamNumber,
    seed: {
      id: flower.seedId ?? null,
      title: flower.seed?.title ?? null,
      authors: flower.seed?.user_profiles ?? null
    },
    flowerTitle: flower?.title ?? null,
    isDelivered
  }
}

const buildExploringGroup = (map, groupNumber) => {
  return {
    id: map.id,
    members: map.participations.map(m => mapGroupMember(m)),
    number: groupNumber,
    seedId: map.seedId ?? null,
    seedTitle: map.seed?.title ?? null,
    isDelivered: map.isDelivered
  }
}

export async function getHackathonExploringGroups (hackathonId) {
  const hackathon = await HackathonsRepository.getHackathonById(null, hackathonId, ROLES.PUBLIC)
  errorThrower(!checkExists(hackathon), 'Hackathon not found', 404)
  if (hackathon.phase === 'GROUP_CREATION') {
    return await GroupsAndTeamsRepository.getConceptualMapsOfHackathon(hackathonId)
  }
  return await getHackathonExploringGroupsAfterCreation(hackathonId)
}

export async function getHackathonCoCreationTeams (userId, hackathonId) {
  const hackathon = await HackathonsRepository.getHackathonById(userId, hackathonId)
  errorThrower(!checkExists(hackathon), 'Hackathon not found', 404)
  if (hackathon.phase === 'TEAM_CREATION') {
    return await FlowersRepository.getFlowersOfHackathon(hackathonId, { userId })
  }
  return await getHackathonCoCreationTeamsAfterCreation(userId, hackathonId)
}

async function getHackathonExploringGroupsAfterCreation (hackathonId) {
  const conceptualMaps = await GroupsAndTeamsRepository.getConceptualMapsOfHackathonWithParticipants(hackathonId)
  return conceptualMaps.map((map, index) => buildExploringGroup(map, index + 1))
}

async function getHackathonCoCreationTeamsAfterCreation (userId, hackathonId) {
  const flowers = await FlowersRepository.getFlowersOfHackathon(hackathonId, { userId })
  return flowers.map((flower, index) => buildCoCreationTeam(flower, index + 1))
}

export async function createExploringGroup (hackathonId, seedId) {
  const existingGroup = await GroupsAndTeamsRepository.getConceptualMapOfSeedInHackathon(seedId, hackathonId)
  errorThrower(checkExists(existingGroup), 'A group already exists for this seed', 409)
  const seedsOfHackathon = await SeedsRepository.getSeedsOfHackathon(hackathonId, { role: ROLES.STAFF })
  errorThrower(!seedsOfHackathon.map(s => s.id).includes(seedId), 'The seed does not belong to this hackathon', 400)
  return await GroupsAndTeamsRepository.createConceptualMapOfSeed(seedId)
}

export async function createCoCreationTeam (hackathonId, seedId) {
  const existingTeam = await FlowersRepository.getFlowerOfSeedInHackathon(seedId, hackathonId)
  errorThrower(checkExists(existingTeam), 'A team already exists for this seed', 409)
  const seedsOfHackathon = await SeedsRepository.getSeedsOfHackathon(hackathonId, { role: ROLES.STAFF })
  errorThrower(!seedsOfHackathon.map(s => s.id).includes(seedId), 'The seed does not belong to this hackathon', 400)
  return await FlowersRepository.createFlowerOfSeed(seedId)
}

export async function getExploringGroupDetails (groupId) {
  if (!groupId) return null

  const conceptualMap = await GroupsAndTeamsRepository.getConceptualMapWithParticipants(groupId)
  if (!conceptualMap) return null
  const groupNumber = await getGroupNumber(conceptualMap)

  return buildExploringGroup(conceptualMap, groupNumber)
}

export const getGroupNumber = async (conceptualMap) => {
  const { hackathonId } = conceptualMap.participations[0]
  const allMaps = await GroupsAndTeamsRepository.getConceptualMapsOfHackathonWithParticipants(hackathonId)
  return allMaps.findIndex(m => m.id === conceptualMap.id) + 1
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

export async function getCoCreationTeamDetails (teamId) {
  if (!teamId) return null

  const flower = await FlowersRepository.getFlowerWithSeedById(teamId, { role: ROLES.STAFF })
  if (!flower) return null
  const teamNumber = await getTeamNumber(flower)

  return buildCoCreationTeam(flower, teamNumber)
}

export const getTeamNumber = async (flower) => {
  const { hackathonId } = flower.participations[0]
  const allFlowers = await FlowersRepository.getFlowersOfHackathon(hackathonId, { role: INTERNAL_BACKEND_ROLE })
  return allFlowers.findIndex(m => m.id === flower.id) + 1
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

const deliverMap = async (mapToUpdate, mapData = undefined) => {
  errorThrower(!checkExists(mapToUpdate), 'Group not found', 404)
  errorThrower(mapToUpdate.isDelivered, 'Conceptual map already delivered', 409)
  if (checkExists(mapData)) {
    mapToUpdate.map = mapData
  }
  if (!mapToUpdate.map) {
    mapToUpdate.map = defaultConceptualMap
  }
  mapToUpdate.isDelivered = true
  await mapToUpdate.save()
}

const deliverFlower = async (flowerToUpdate) => {
  errorThrower(!checkExists(flowerToUpdate), 'Flower not found', 404)
  const isDelivered = flowerToUpdate?.state === 'IN_REVIEW' || flowerToUpdate?.state === 'PUBLISHED'

  errorThrower(isDelivered, 'Flower already delivered', 409)
  flowerToUpdate.state = 'IN_REVIEW'
  await flowerToUpdate.save()
}

export async function submitConceptualMap (userId, groupId, map) {
  const userParticipation = await checkUserIsGroupVoice(userId, groupId)

  const mapToUpdate = await GroupsAndTeamsRepository.getConceptualMap(groupId)
  await deliverMap(mapToUpdate, map)

  return userParticipation.id
}

export async function submitFlower (userId, teamId) {
  const userParticipation = await checkUserIsTeamSpeaker(userId, teamId)

  const flowerToUpdate = await FlowersRepository.getFlowerWithSeedById(teamId, { role: ROLES.STAFF })
  await deliverFlower(flowerToUpdate)

  return userParticipation.id
}

export async function reopenFlower (teamId) {
  const flowerToUpdate = await FlowersRepository.getFlowerWithSeedById(teamId, { role: ROLES.STAFF })
  errorThrower(!checkExists(flowerToUpdate), 'Flower not found', 404)
  const isDelivered = flowerToUpdate?.state === 'IN_REVIEW' || flowerToUpdate?.state === 'PUBLISHED'
  errorThrower(!isDelivered, 'Flower already open', 409)
  flowerToUpdate.state = 'IN_PROGRESS'
  await flowerToUpdate.save()

  return { flower: flowerToUpdate, hackathonId: flowerToUpdate.participations[0]?.hackathonId }
}

export async function deliverAllConceptualMapsOfHackathon (hackathonId) {
  const maps = await GroupsAndTeamsRepository.getConceptualMapsOfHackathon(hackathonId)
  return Promise.all(maps.map((map) => {
    if (!map.isDelivered) {
      return deliverMap(map)
    }
    return null
  }))
}

export async function reopenConceptualMap (groupId) {
  const mapToUpdate = await GroupsAndTeamsRepository.getConceptualMapWithParticipants(groupId)
  errorThrower(!checkExists(mapToUpdate), 'Group not found', 404)
  errorThrower(!mapToUpdate.isDelivered, 'Conceptual map already open', 409)
  mapToUpdate.isDelivered = false
  await mapToUpdate.save()

  return { map: mapToUpdate, hackathonId: mapToUpdate.participations[0]?.hackathonId }
}

export async function getConceptualMap (userId, groupId) {
  const conceptualMap = await GroupsAndTeamsRepository.getConceptualMapWithSeeds(groupId)
  errorThrower(!checkExists(conceptualMap), 'Map not found', 404)

  if (conceptualMap.isDelivered) {
    return conceptualMap
  }

  const hackathonId = (await ParticipationsRepository.getMinimalParticipationInHackathon(
    { groupId }
  ))?.hackathonId

  errorThrower(!checkExists(hackathonId), 'Group not found', 404)

  await checkUserIsInHackathon(userId, hackathonId)

  return conceptualMap
}

export const deleteUnassignedConceptualMapsOfHackathon = async (hackathonId) => {
  const participations = await ParticipationsRepository.getMinimalParticipationsOfHackathon({ hackathonId })

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
