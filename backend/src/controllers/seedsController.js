import * as service from '../services/seedsService.js'
import { withErrorHandler } from './errorHandling.js'

export const getSeedsByEdition = withErrorHandler(async (req, res) => {
  const query = req.query
  console.log(query)
  return res.status(200)
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
