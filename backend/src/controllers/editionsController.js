import * as service from '../services/editionsService.js'
import * as UsersService from '../services/usersService.js'
import { withErrorHandler } from './errorHandling.js'

export const getEditions = withErrorHandler(async (req, res) => {
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const editions = await service.getEditions(currentUser?.id)
  return res.status(200).send(editions)
})

export function createEdition (req, res) {
  service.createEdition(req, res)
}

export const getEditionDetails = withErrorHandler(async (req, res) => {
  const editionId = req.params.editionId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const edition = await service.getEditionDetails(currentUser?.id, editionId)
  return res.status(200).send(edition)
})

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
