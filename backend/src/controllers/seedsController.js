import * as service from '../services/seedsService.js'

export function getSeedsByEdition (req, res) {
  service.getSeedsByEdition(req, res)
}

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
