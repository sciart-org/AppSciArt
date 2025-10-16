import { errorThrower } from '../services/errorThrower.js'
import * as service from '../services/seedsService.js'
import * as UsersService from '../services/usersService.js'
import { checkExists } from '../validators/generalValidators.js'
import { withErrorHandler } from './errorHandling.js'

export const getSeeds = withErrorHandler(async (req, res) => {
  const editionId = req.query.editionId
  const hackathonId = req.query.hackathonId
  const currentUser = await UsersService.getCurrentUserProfile(req)

  errorThrower(!checkExists(editionId) && !checkExists(hackathonId), 'Either an edition or hackathon must be provided')
  let seeds = []

  if (checkExists(editionId)) {
    seeds = await service.getSeedsByEdition(currentUser?.id, editionId)
  } else if (checkExists(hackathonId)) {
    seeds = await service.getSeedsByHackathon(currentUser?.id, hackathonId)
  }

  return res.status(200).send(seeds)
})

export function createSeed (req, res) {
  service.createSeed(req, res)
}

export const getSeedDetails = withErrorHandler(async (req, res) => {
  const seedId = req.params.seedId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const seed = await service.getSeedDetails(currentUser?.id, seedId)
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

export const getSeedConceptualMapsIds = withErrorHandler(async (req, res) => {
  const seedId = req.params.seedId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const conceptualMapsIds = await service.getSeedConceptualMapIds(currentUser?.id, seedId)
  return res.status(200).send(conceptualMapsIds.map(cm => cm.id))
})
