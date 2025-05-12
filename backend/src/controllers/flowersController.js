import * as service from '../services/flowersService.js'

export function getFlowersByEdition (req, res) {
  service.getFlowersByEdition(req, res)
}

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
