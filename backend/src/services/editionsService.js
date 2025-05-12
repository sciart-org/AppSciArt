import { EditionModel } from '../models/editions.js'
import { validateEdition } from '../schemas/edition.js'

export async function getEditions (req, res) {
  try {
    const editions = await EditionModel.getAll()
    res.status(200).send(editions)
  } catch (error) {
    console.error('Error getting editions:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

export async function createEdition (req, res) {
  const result = validateEdition(req.body)
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const newEdition = await EditionModel.create({ body: result.data })
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
