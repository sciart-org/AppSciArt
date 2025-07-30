import * as service from '../services/editionsService.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { withErrorHandler } from './errorHandling.js'

export const getEditions = withErrorHandler(async (req, res) => {
  const showUnpublished = await checkIsStaff(req)
  const editions = await service.getAllEditions(showUnpublished)
  return res.status(200).send(editions)
})

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
