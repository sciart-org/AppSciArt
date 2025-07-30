import { errorThrower } from '../services/errorThrower.js'
import * as service from '../services/seedsService.js'
import { validateEditionById } from '../validators/EditionValidators.js'
import { checkExists } from '../validators/generalValidators.js'
import { validateHackathonById } from '../validators/hackathonValidators.js'
import { validateIsPublishedOrStaff } from '../validators/productValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { withErrorHandler } from './errorHandling.js'

export const getSeeds = withErrorHandler(async (req, res) => {
  const editionId = req.query.editionId
  const hackathonId = req.query.hackathonId
  errorThrower(!checkExists(editionId) && !checkExists(hackathonId), 'Either an edition or hackathon must be provided')
  let seeds = []
  const showUnpublished = await checkIsStaff(req)

  if (checkExists(editionId)) {
    await validateEditionById(req, editionId)
    seeds = await service.getSeedsByEdition(editionId, showUnpublished)
  } else if (checkExists(hackathonId)) {
    await validateHackathonById(req, hackathonId)
    seeds = await service.getSeedsByHackathon(hackathonId, showUnpublished)
  }

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
