import { Edition } from '../models/Edition.js'
import { validateEdition } from '../schemas/edition.js'

export const mapToEditionSummary = (rawEdition) => {
  const edition = rawEdition.toJSON()
  return {
    id: edition.id,
    name: edition.name,
    logo: edition.logo,
    year: edition.year,
    shortDescription: edition.shortDescription,
    isVisible: edition.isVisible
  }
}

export async function getAllEditions (showUnpublished) {
  const rawResponse = await Edition.findAll({
    where: showUnpublished ? {} : { state: 'PUBLISHED' },
    order: [['year', 'DESC']]
  })
  return rawResponse.map(e => mapToEditionSummary(e))
}

export async function createEdition (req, res) {
  const result = validateEdition(req.body)
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const newEdition = await Edition.create({ body: result.data })
  res.status(201).send(newEdition)
}

export function getEditionDetails (req, res) {
  res.send({
    message: 'This is the mockup controller for getEditionDetails'
  })
}

export function updateEdition (req, res) {
  res.send({
    message: 'This is the mockup controller for updateEdition'
  })
}

export function deleteEdition (req, res) {
  res.send({
    message: 'This is the mockup controller for deleteEdition'
  })
}

export function publishEdition (req, res) {
  res.send({
    message: 'This is the mockup controller for publishEdition'
  })
}

export function getEditionMethodology (req, res) {
  res.send({
    message: 'This is the mockup controller for getEditionMethodology'
  })
}
