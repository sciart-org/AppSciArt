import { Edition } from '../models/Edition.js'
import { validateEdition } from '../schemas/edition.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { validateEditionById } from '../validators/editionValidators.js'
import { Fruit } from '../models/Fruit.js'
import { Seed } from '../models/Seed.js'
import { Flower } from '../models/Flower.js'

export const mapToEditionSummary = (rawEdition) => {
  const edition = rawEdition.toJSON()
  return {
    id: edition.id,
    name: edition.name,
    logo: edition.logo,
    year: edition.year,
    shortDescription: edition.shortDescription,
    state: edition.state
  }
}

const mapToEditionDetails = (rawEdition) => {
  const edition = rawEdition.toJSON()
  return {
    id: edition.id,
    name: edition.name,
    logo: edition.logo,
    year: edition.year,
    longDescription: edition.longDescription,
    catalogLink: edition.catalogLink,
    fruits: edition.seeds?.flatMap(seed => seed.flowers?.flatMap(flower => flower.fruits)),
    state: edition.state
  }
}

export async function getEditions (userId) {
  const showUnpublished = await checkIsStaff(userId)
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

export async function getEditionDetails (userId, editionId) {
  await validateEditionById(userId, editionId)
  const edition = await Edition.findByPk(editionId, {
    include: [
      {
        model: Seed,
        through: { attributes: [] },
        attributes: ['id'],
        include: [
          {
            model: Flower,
            attributes: ['id'],
            include: [
              {
                model: Fruit
              }
            ]
          }
        ]
      }
    ]
  })
  return mapToEditionDetails(edition)
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
