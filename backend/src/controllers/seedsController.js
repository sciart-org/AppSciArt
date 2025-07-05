import * as service from '../services/seedsService.js'
import { withErrorHandler } from './errorHandling.js'

export const getSeedsByEdition = withErrorHandler(async (req, res) => {
  const editionId = req.query.editionId
  const seeds = await service.getSeedsByEdition(editionId)
  return res.status(200).send(seeds)
})

export function createSeed (req, res) {
  service.createSeed(req, res)
}

export function getSeedDetails (req, res) {
  service.getSeedDetails(req, res)
}

export function updateSeed (req, res) {
  service.updateSeed(req, res)
}

export function deleteSeed (req, res) {
  service.deleteSeed(req, res)
}

export function publishSeed (req, res) {
  service.publishSeed(req, res)
}
