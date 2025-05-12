import * as service from '../services/fruitsService.js'

export function getFruitsByEdition (req, res) {
  service.getFruitsByEdition(req, res)
}

export function createFruit (req, res) {
  service.createFruit(req, res)
}

export function getFruitDetails (req, res) {
  service.getFruitDetails(req, res)
}

export function updateFruit (req, res) {
  service.updateFruit(req, res)
}

export function deleteFruit (req, res) {
  service.deleteFruit(req, res)
}

export function publishFruit (req, res) {
  service.publishFruit(req, res)
}
