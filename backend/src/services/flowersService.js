import { errorThrower } from './errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'
import { validateCanSeeEdition } from '../validators/editionValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import * as FlowersRepository from '../repositories/flowersRepository.js'
import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'
import { validateHackathonIsReadable } from '../validators/hackathonValidators.js'
import * as ParticipationsRepository from '../repositories/participationsRepository.js'
import * as DriveService from '../services/driveService.js'
import * as HackathonRepository from '../repositories/hackathonsRepository.js'
import { INTERNAL_BACKEND_ROLE } from './Roles.js'

export async function getFlowersByEdition (userId, editionId) {
  await validateCanSeeEdition(userId, editionId)
  const isAdmin = await checkIsStaff(userId)
  return await FlowersRepository.getFlowersOfEdition(editionId, isAdmin)
}

export async function getFlowersByHackathon (userId, hackathonId) {
  await validateHackathonIsReadable(userId, hackathonId)
  const isAdmin = await checkIsStaff(userId)
  return await FlowersRepository.getFlowersOfHackathon(hackathonId, isAdmin)
}

export function createFlower (req, res) {
  res.send({
    message: 'This is the mockup controller for createFlower'
  })
}

const checkFlowerExists = async (flowerId) => {
  const exists = await FlowersRepository.getMinimalFlowerUnrestricted(flowerId)
  errorThrower(checkExists(exists), 'Unauthorized: You cannot access this flower', 403)
  errorThrower(true, 'Flower not found', 404)
}

export async function getFlowerDetails (userId, flowerId) {
  const isAdmin = await checkIsStaff(userId)
  const flowerOwners = await ParticipationsRepository.getParticipationsOfHackathon({ teamId: flowerId })
  const isInTeam = flowerOwners.map(participant => participant.user_profile.id).includes(userId)
  const isOwner = isAdmin || isInTeam
  const flower = await FlowersRepository.getFlowerWithSeedById(flowerId, isOwner)

  if (!checkExists(flower)) {
    await checkFlowerExists(flowerId)
  }

  if (!isOwner) {
    return flower
  }

  const [flowerWithTemplate] = await DriveService.getFlowersWithTemplate([flower])
  return flowerWithTemplate
}

export function updateFlower (req, res) {
  res.send({
    message: 'This is the mockup controller for updateFlower'
  })
}

export function deleteFlower (req, res) {
  res.send({
    message: 'This is the mockup controller for deleteFlower'
  })
}

export function publishFlower (req, res) {
  res.send({
    message: 'This is the mockup controller for publishFlower'
  })
}

export const createFlowersOfHackathon = async (hackathonId) => {
  const hackathonGroups = await GroupsAndTeamsRepository.getConceptualMapsOfHackathon(hackathonId)
  return Promise.all(hackathonGroups.map(g => FlowersRepository.createFlowerOfSeed(g.seedId)))
}

export const deleteUnassignedFlowersOfHackathon = async (hackathonId) => {
  const participations = await ParticipationsRepository.getMinimalParticipationsOfHackathon({ hackathonId })

  const associatedTeamIds = participations.map(p => p.teamId).filter(Boolean)
  const teamsOfHackathon = await FlowersRepository.getFlowersOfHackathon(hackathonId, true)
  const teamIdsInHackathon = teamsOfHackathon.map(m => m.id)
  if (!teamIdsInHackathon.length) return 0

  const unassignedIds = teamsOfHackathon
    .map(m => m.id)
    .filter(id => !associatedTeamIds.includes(id))

  return Promise.all(unassignedIds.map(FlowersRepository.deleteFlower))
}

export const setHackathonFlowersToInProgress = async (hackathonId) => {
  const [flowers, hackathon] = await Promise.all([
    FlowersRepository.getFlowersOfHackathon(hackathonId, true),
    HackathonRepository.getHackathonById(null, hackathonId, INTERNAL_BACKEND_ROLE)
  ])
  await Promise.all(flowers.map(async (f, index) => {
    if (f.state !== 'IN_BLANK') return
    const teamNumber = index + 1
    f.state = 'IN_PROGRESS'
    f.driveLink = await DriveService.createDriveFlower(hackathon.driveLink, teamNumber, f.seed?.title)
    return f.save()
  }))
}

export const createHackathonFlowerRubrics = async (hackathonId) => {
  const [hackathon, evaluators] = await Promise.all([
    HackathonRepository.getHackathonById(null, hackathonId, INTERNAL_BACKEND_ROLE),
    HackathonRepository.getEvaluatorsOfHackathon(hackathonId)
  ])
  const evaluatorNames = evaluators.map(e => `${e.user_profile.name} ${e.user_profile.surname}`)
  await DriveService.createFlowerRubrics(evaluatorNames, hackathon.driveLink)
}
