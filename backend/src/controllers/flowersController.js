import { errorThrower } from '../services/errorThrower.js'
import * as service from '../services/flowersService.js'
import * as UsersService from '../services/usersService.js'
import { checkExists } from '../validators/generalValidators.js'
import { withErrorHandler } from './errorHandling.js'

export const getFlowers = withErrorHandler(async (req, res) => {
  const editionId = req.query.editionId
  const hackathonId = req.query.hackathonId
  const currentUser = await UsersService.getCurrentUserProfile(req)

  errorThrower(!checkExists(editionId) && !checkExists(hackathonId), 'Either an edition or hackathon must be provided')
  let flowers = []

  if (checkExists(editionId)) {
    flowers = await service.getFlowersByEdition(currentUser?.id, editionId)
  } else if (checkExists(hackathonId)) {
    flowers = await service.getFlowersByHackathon(currentUser?.id, hackathonId)
  }

  return res.status(200).send(flowers)
})

export function createFlower (req, res) {
  service.createFlower(req, res)
}

export const getFlowerDetails = withErrorHandler(async (req, res) => {
  const flowerId = req.params.flowerId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const flower = await service.getFlowerDetails(currentUser?.id, flowerId)
  return res.status(200).send(flower)
})

export function updateFlower (req, res) {
  service.updateFlower(req, res)
}

export function deleteFlower (req, res) {
  service.deleteFlower(req, res)
}

export function publishFlower (req, res) {
  service.publishFlower(req, res)
}
