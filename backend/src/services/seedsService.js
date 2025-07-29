import { Edition } from '../models/Edition.js'
import { Hackathon } from '../models/Hackathon.js'
import { Seed } from '../models/Seed.js'
import { checkExists } from '../validators/generalValidators.js'
import { errorThrower } from './errorThrower.js'
import { filterPublished, includeSeedAuthors, mapToSeedSummary } from './productUtils.js'

export async function getSeedsByEdition (editionId, showUnpublished) {
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

export async function getSeedsByHackathon (hackathonId, showUnpublished) {
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

export async function getSeedDetails (seedId) {
  const seed = await Seed.findByPk(seedId)
  errorThrower(!checkExists(seed), 'Seed not found', 404)
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
