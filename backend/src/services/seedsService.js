import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'

export async function getSeedsByEdition (editionId) {
  return await Seed.findAll({
    include: {
      model: Edition,
      where: { id: editionId },
      attributes: [],
      through: { attributes: [] }
    }
  })
}

export function createSeed (req, res) {
  res.send({
    message: 'This is the mockup controller for createSeed'
  })
}

export function getSeedDetails (req, res) {
  res.send({
    message: 'This is the mockup controller for getSeedDetails'
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
