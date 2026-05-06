import { errorThrower } from './errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'
import { validateCanSeeEdition } from '../validators/editionValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import * as FlowersRepository from '../repositories/flowersRepository.js'
import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'
import { validateHackathonIsReadable } from '../validators/hackathonValidators.js'

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
  const flower = await FlowersRepository.getFlowerWithSeedById(flowerId, isAdmin)

  if (!checkExists(flower)) {
    await checkFlowerExists(flowerId)
  }

  return flower
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
