import * as service from '../services/fruitsService.js'
import { withErrorHandler } from './errorHandling.js'

export const getFruitsByEdition = withErrorHandler(async (req, res) => {
  const editionId = req.query.editionId
  const fruits = await service.getFruitsByEdition(editionId)
  return res.status(200).send(fruits)
})

export function createFruit (req, res) {
  service.createFruit(req, res)
}

export const getFruitDetails = withErrorHandler(async (req, res) => {
  const fruitId = req.params.fruitId
  const fruit = await service.getFruitDetails(fruitId)
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
