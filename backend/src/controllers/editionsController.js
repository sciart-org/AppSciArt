import * as service from '../services/editionsService.js'
import { withErrorHandler } from './errorHandling.js'

export const getEditions = withErrorHandler(async (req, res) => {
  const { visibility } = req.query

  if (visibility === 'published') {
    const editions = await service.getPublishedEditions()
    return res.status(200).send(editions)
  }

  if (visibility === 'all') {
    const editions = await service.getAllEditions()
    return res.status(200).send(editions)
  }

  return res.status(400).json({
    message: 'Invalid visibility, or not yet implemented'
  })
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
