import { validateAuthenticated } from '../middlewares/authMiddleware.js'
import { errorThrower } from '../services/errorThrower.js'
import * as service from '../services/seedsService.js'
import * as UsersService from '../services/usersService.js'
import { checkExists } from '../validators/generalValidators.js'
import { withController } from './controllerHandlers.js'

export const getSeeds = withController(async (req, res) => {
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

export const createSeed = withController(async (req, res) => {
  const currentUser = await validateAuthenticated(req)

  const { title, editionId, mainImage, branchesOfKnowledge } = req.body
  const body = { title, editionId, mainImage, branchesOfKnowledge }

  const createdSeed = await service.createSeed(currentUser.id, body)
  const [fullSeed] = await service.getFullSeedsDetails([createdSeed])
  return res.status(201).send(fullSeed)
})

export const getSeedDetails = withController(async (req, res) => {
  const seedId = req.params.seedId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const seed = await service.getSeedDetails(currentUser?.id, seedId)
  return res.status(200).send(seed)
})

export const updateSeed = withController(async (req, res) => {
  const currentUser = await validateAuthenticated(req)

  const { title, mainImage, branchesOfKnowledge, videoLink, presentationLink, podcastLink } = req.body
  const body = { title, mainImage, branchesOfKnowledge, videoLink, presentationLink, podcastLink }

  const updatedSeed = await service.updateSeed(currentUser.id, req.params.seedId, body)

  const [fullSeed] = await service.getFullSeedsDetails([updatedSeed])
  return res.status(200).send(fullSeed)
})

export function deleteSeed (req, res) {
  service.deleteSeed(req, res)
}

export function publishSeed (req, res) {
  service.publishSeed(req, res)
}

export const getSeedConceptualMapsIds = withController(async (req, res) => {
  const seedId = req.params.seedId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const conceptualMapsIds = await service.getSeedConceptualMapIds(currentUser?.id, seedId)
  return res.status(200).send(conceptualMapsIds.map(cm => cm.id))
})
