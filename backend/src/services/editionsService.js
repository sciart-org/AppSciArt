import { Edition } from '../models/Edition.js'
import { validateEdition } from '../schemas/edition.js'

export async function getAllEditions () {
  return await Edition.findAll({
    order: [['year', 'DESC']]
  })
}

export async function getPublishedEditions () {
  return await Edition.findAll({
    where: { isVisible: true },
    order: [['year', 'DESC']]
  })
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
