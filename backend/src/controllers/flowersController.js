import * as service from '../services/flowersService.js'
import { withErrorHandler } from './errorHandling.js'

export const getFlowersByEdition = withErrorHandler(async (req, res) => {
  const editionId = req.query.editionId
  const flowers = await service.getFlowersByEdition(editionId)
  return res.status(200).send(flowers)
})

export function createFlower (req, res) {
  service.createFlower(req, res)
}

export function getFlowerDetails (req, res) {
  service.getFlowerDetails(req, res)
}

export function updateFlower (req, res) {
  service.updateFlower(req, res)
}

export function deleteFlower (req, res) {
  service.deleteFlower(req, res)
}

export function publishFlower (req, res) {
  service.publishFlower(req, res)
}
