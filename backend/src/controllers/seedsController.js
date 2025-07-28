import * as service from '../services/seedsService.js'
import { validateIsPublishedOrStaff } from '../validators/productValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { withErrorHandler } from './errorHandling.js'

export const getSeedsByEdition = withErrorHandler(async (req, res) => {
  const showUnpublished = await checkIsStaff(req)
  const editionId = req.query.editionId
  const seeds = await service.getSeedsByEdition(editionId, showUnpublished)
  return res.status(200).send(seeds)
})

export function createSeed (req, res) {
  service.createSeed(req, res)
}

export const getSeedDetails = withErrorHandler(async (req, res) => {
  const seedId = req.params.seedId
  const seed = await service.getSeedDetails(seedId)
  await validateIsPublishedOrStaff(req, seed)
  return res.status(200).send(seed)
})

export function updateSeed (req, res) {
  service.updateSeed(req, res)
}

export function deleteSeed (req, res) {
  service.deleteSeed(req, res)
}

export function publishSeed (req, res) {
  service.publishSeed(req, res)
}
