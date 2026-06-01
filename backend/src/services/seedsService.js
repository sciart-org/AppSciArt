import { Seed } from '../models/Seed.js'
import { validateCanSeeEdition } from '../validators/editionValidators.js'
import { checkExists } from '../validators/generalValidators.js'
import { validateHackathonIsReadable } from '../validators/hackathonValidators.js'
import { checkIsInspiringScientist, checkIsStaff } from '../validators/userValidators.js'
import { errorThrower } from './errorThrower.js'
import * as SeedsRepository from '../repositories/seedsRepository.js'
import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'
import * as EditionsRepository from '../repositories/editionsRepository.js'
import { ROLES } from './Roles.js'
import { createDriveSeed, getEntitiesWithImage, getProductsWithTemplate, parseFolderName, updateFolderName, uploadImg } from './driveService.js'
import * as ScientistsRepository from '../repositories/scientistsRepository.js'
import { validateSeedNameUnique } from '../validators/productValidators.js'

const getSeedsWithTemplate = (seeds) => {
  return getProductsWithTemplate(seeds, 'seedTemplate')
}

const getSeedsWithImage = async (seeds) => {
  return await getEntitiesWithImage(seeds, Seed, 'mainImage')
}

export const getFullSeedsDetails = async (seeds) => {
  const seedsWithTemplate = await getSeedsWithTemplate(seeds)
  const seedsWithTemplateAndImage = await getSeedsWithImage(seedsWithTemplate)
  return seedsWithTemplateAndImage
}

export async function getSeedsByEdition (userId, editionId) {
  await validateCanSeeEdition(userId, editionId)
  const seeds = await SeedsRepository.getSeedsOfEdition(editionId, { userId })
  return await getFullSeedsDetails(seeds)
}

export async function getSeedsByHackathon (userId, hackathonId) {
  await validateHackathonIsReadable(userId, hackathonId)
  const seeds = await SeedsRepository.getSeedsOfHackathon(hackathonId, { userId })
  return await getFullSeedsDetails(seeds)
}

export async function createSeed (userId, body) {
  const { title, editionId, mainImage, branchesOfKnowledge } = body
  const isStaff = await checkIsStaff(userId)
  const isScientist = await checkIsInspiringScientist(userId, { editionId })
  errorThrower(!(isScientist || isStaff), 'Unauthorized: You cannot create this resource', 403)

  const edition = await EditionsRepository.getEditionDetails(editionId, { role: ROLES.STAFF })
  errorThrower(!checkExists(edition), 'Edition not found', 404)

  await validateSeedNameUnique(title)

  const driveLink = await createDriveSeed(edition.driveLink, title, mainImage)
  const newSeed = await Seed.create({ title, branchesOfKnowledge, driveLink })
  await newSeed.addEdition(edition)
  if (isScientist) {
    await newSeed.addUser_profile(userId)
  }

  return newSeed
}

export async function getSeedDetails (userId, seedId) {
  const seed = await SeedsRepository.getSeedById(seedId, { userId })
  errorThrower(!checkExists(seed), 'Seed not found', 404)
  const [fullSeed] = await getFullSeedsDetails([seed])
  return fullSeed
}

export async function getSeedConceptualMapIds (userId, seedId) {
  const seed = await SeedsRepository.getMinimalSeedById(seedId, { userId })
  errorThrower(!checkExists(seed), 'Seed not found', 404)
  const conceptualMapsIds = await GroupsAndTeamsRepository.getDeliveredMapIdsOfSeed(seedId)
  return conceptualMapsIds
}

export async function updateSeed (userId, seedId, body) {
  const seedToUpdate = await SeedsRepository.getSeedById(seedId, { userId })
  errorThrower(!checkExists(seedToUpdate), 'Seed not found', 404)

  const isStaff = await checkIsStaff(userId)
  const isScientist = await ScientistsRepository.isScientistOfSeed(userId, seedId)

  errorThrower(!(isScientist || isStaff), 'Unauthorized: You cannot edit this seed', 403)
  errorThrower(!isStaff && seedToUpdate.state !== 'IN_PROGRESS', 'Unauthorized: You cannot edit a published seed', 403)

  const { title, mainImage, branchesOfKnowledge, videoLink, presentationLink, podcastLink } = body

  if (title) {
    await validateSeedNameUnique(title, seedId)
    const newFolderName = parseFolderName(title)
    await updateFolderName(seedToUpdate.driveLink, newFolderName)
  }

  if (mainImage) {
    await uploadImg(mainImage, seedToUpdate.driveLink, 'mainImage.png')
  }

  const seedBody = { title, branchesOfKnowledge, videoLink, presentationLink, podcastLink }
  if (Object.values(seedBody).some(v => v !== undefined)) {
    await seedToUpdate.update(seedBody)
  }

  const [fullSeed] = await getFullSeedsDetails([seedToUpdate])
  return fullSeed
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
