import { Edition } from '../models/Edition.js'
import { Hackathon } from '../models/Hackathon.js'
import { Seed } from '../models/Seed.js'
import { validateEditionById } from '../validators/editionValidators.js'
import { checkExists } from '../validators/generalValidators.js'
import { validateHackathonById } from '../validators/hackathonValidators.js'
import { validateIsPublishedOrStaff } from '../validators/productValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { errorThrower } from './errorThrower.js'
import { filterPublished, includeSeedAuthors, mapToSeedSummary } from './productUtils.js'

export async function getSeedsByEdition (userId, editionId) {
  await validateEditionById(userId, editionId)
  const showUnpublished = await checkIsStaff(userId)
  const rawResponse = await Seed.findAll({
    where: showUnpublished ? {} : filterPublished,
    include: [
      {
        model: Edition,
        where: { id: editionId },
        attributes: [],
        through: { attributes: [] }
      },
      includeSeedAuthors
    ]
  })
  return rawResponse.map(s => mapToSeedSummary(s))
}

export async function getSeedsByHackathon (userId, hackathonId) {
  await validateHackathonById(userId, hackathonId)
  const showUnpublished = await checkIsStaff(userId)
  const rawResponse = await Seed.findAll({
    where: showUnpublished ? {} : filterPublished,
    include: [
      {
        model: Hackathon,
        where: { id: hackathonId },
        attributes: [],
        through: { attributes: [] }
      },
      includeSeedAuthors
    ]
  })
  return rawResponse.map(s => mapToSeedSummary(s))
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
