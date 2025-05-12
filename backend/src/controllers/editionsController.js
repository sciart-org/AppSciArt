import * as service from '../services/editionsService.js'

export function getEditions (req, res) {
  service.getEditions(req, res)
}

export function createEdition (req, res) {
  service.createEdition(req, res)
}

export function getEditionDetails (req, res) {
  service.getEditionDetails(req, res)
}

export function updateEdition (req, res) {
  service.updateEdition(req, res)
}

export function deleteEdition (req, res) {
  service.deleteEdition(req, res)
}

export function publishEdition (req, res) {
  service.publishEdition(req, res)
}

export function getEditionMethodology (req, res) {
  service.getEditionMethodology(req, res)
}
