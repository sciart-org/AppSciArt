import * as service from '../services/fruitsService.js'
import * as UsersService from '../services/usersService.js'
import { withController } from './controllerHandlers.js'

export const getFruitsByEdition = withController(async (req, res) => {
  const editionId = req.query.editionId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const fruits = await service.getFruitsByEdition(currentUser?.id, editionId)
  return res.status(200).send(fruits)
})

export function createFruit (req, res) {
  service.createFruit(req, res)
}

export const getFruitDetails = withController(async (req, res) => {
  const fruitId = req.params.fruitId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const fruit = await service.getFruitDetails(currentUser?.id, fruitId)
  return res.status(200).send(fruit)
})

export function updateFruit (req, res) {
  service.updateFruit(req, res)
}

export function deleteFruit (req, res) {
  service.deleteFruit(req, res)
}

export function publishFruit (req, res) {
  service.publishFruit(req, res)
}
