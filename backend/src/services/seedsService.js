import { Seed } from '../models/Seed.js'
import { validateCanSeeEdition } from '../validators/editionValidators.js'
import { checkExists } from '../validators/generalValidators.js'
import { validateHackathonIsReadable } from '../validators/hackathonValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { errorThrower } from './errorThrower.js'
import { Edition } from '../models/Edition.js'
import * as SeedsRepository from '../repositories/seedsRepository.js'
import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'

const checkSeedExists = async (seedId) => {
  const exists = await SeedsRepository.getMinimalSeedUnrestricted(seedId)
  errorThrower(checkExists(exists), 'Unauthorized: You cannot access this seed', 403)
  errorThrower(true, 'Seed not found', 404)
}

export async function getSeedsByEdition (userId, editionId) {
  await validateCanSeeEdition(userId, editionId)
  const isAdmin = await checkIsStaff(userId)
  return await SeedsRepository.getSeedsOfEdition(editionId, isAdmin)
}

export async function getSeedsByHackathon (userId, hackathonId) {
  await validateHackathonIsReadable(userId, hackathonId)
  const isAdmin = await checkIsStaff(userId)
  return await SeedsRepository.getSeedsOfHackathon(hackathonId, isAdmin)
}

export async function createSeed (userId, title, editionId, template) {
  errorThrower(!(await checkIsStaff(userId)), 'Unauthorized: You cannot create this resource', 403)

  const edition = await Edition.findByPk(editionId)
  errorThrower(!checkExists(edition), 'Edition not found', 404)

  const newSeed = await Seed.create({
    title,
    template
  })

  await newSeed.addEdition(edition)

  return newSeed
}

export async function getSeedDetails (userId, seedId) {
  const isAdmin = await checkIsStaff(userId)
  const seed = await SeedsRepository.getSeedById(seedId, userId, isAdmin)

  if (!checkExists(seed)) {
    await checkSeedExists(seedId)
  }

  return seed
}

export async function getSeedConceptualMapIds (userId, seedId) {
  const isAdmin = await checkIsStaff(userId)
  const seed = await SeedsRepository.getMinimalSeedById(seedId, userId, isAdmin)

  if (!checkExists(seed)) {
    await checkSeedExists(seedId)
  }

  const conceptualMapsIds = await GroupsAndTeamsRepository.getDeliveredMapIdsOfSeed(seedId)

  return conceptualMapsIds
}

export function updateSeed (req, res) {
  res.send({
    message: 'This is the mockup controller for updateSeed'
  })
}

export function deleteSeed (req, res) {
  res.send({
    message: 'This is the mockup controller for deleteSeed'
  })
}

export function publishSeed (req, res) {
  res.send({
    message: 'This is the mockup controller for publishSeed'
  })
}
