import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'
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

export function createSeed (req, res) {
  res.send({
    message: 'This is the mockup controller for createSeed'
  })
}

export async function getSeedDetails (seedId) {
  return await Seed.findOne({
    where: {
      id: seedId
    }
  })
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
