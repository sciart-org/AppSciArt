import { mapSeedAuthors } from './mappers/productMapper.js'
import { Hackathon } from '../models/Hackathon.js'
import { Seed } from '../models/Seed.js'
import { validateEditionById } from '../validators/editionValidators.js'
import { checkExists } from '../validators/generalValidators.js'
import { validateHackathonIsReadable } from '../validators/hackathonValidators.js'
import { validateIsPublishedOrStaff } from '../validators/productValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { errorThrower } from './errorThrower.js'
import { filterPublished, includeEdition, includeSeedAuthors } from './includes/productIncludes.js'
import { ConceptualMap } from '../models/ConceptualMap.js'

export async function getSeedsByEdition (userId, editionId) {
  await validateEditionById(userId, editionId)
  const showUnpublished = await checkIsStaff(userId)
  const rawResponse = await Seed.findAll({
    where: showUnpublished ? {} : filterPublished,
    attributes: ['id', 'title', 'mainImage', 'branchesOfKnowledge'],
    include: [
      {
        ...includeEdition(editionId),
        through: { attributes: [] }
      },
      includeSeedAuthors
    ]
  })
  return rawResponse.map(s => mapSeedAuthors(s))
}

export async function getSeedsByHackathon (userId, hackathonId) {
  await validateHackathonIsReadable(userId, hackathonId)
  const showUnpublished = await checkIsStaff(userId)
  const seeds = await Seed.findAll({
    where: showUnpublished ? {} : filterPublished,
    attributes: ['id', 'title', 'mainImage'],
    include: [
      {
        model: Hackathon,
        where: { id: hackathonId },
        attributes: [],
        through: { attributes: [] }
      }
    ]
  })
  return seeds
}

export function createSeed (req, res) {
  res.send({
    message: 'This is the mockup controller for createSeed'
  })
}

export async function getSeedDetails (userId, seedId) {
  const seed = await Seed.findByPk(seedId)
  errorThrower(!checkExists(seed), 'Seed not found', 404)
  await validateIsPublishedOrStaff(userId, seed)
  return seed
}

export async function getSeedConceptualMapIds (userId, seedId) {
  const seed = await Seed.findByPk(seedId, { attributes: ['id', 'state'] })
  errorThrower(!checkExists(seed), 'Seed not found', 404)
  await validateIsPublishedOrStaff(userId, seed)
  const conceptualMapsIds = await ConceptualMap.findAll({
    where: {
      seedId,
      isDelivered: true
    },
    attributes: ['id']
  })
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
