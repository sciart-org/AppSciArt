import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'
import { Flower } from '../models/Flower.js'
import { Fruit } from '../models/Fruit.js'
import { filterPublished, includeFruitAuthors, includeSeedAuthors, mapToFruitPublicDetail, mapToFruitSummary } from './productUtils.js'
import { errorThrower } from './errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'

export async function getFruitsByEdition (editionId, showUnpublished) {
  const rawResponse = await Fruit.findAll({
    where: showUnpublished ? {} : filterPublished,
    include: [
      {
        model: Flower,
        required: true,
        include: {
          model: Seed,
          required: true,
          include: {
            model: Edition,
            where: { id: editionId },
            attributes: []
          },
          attributes: ['id', 'title']
        },
        attributes: ['id']
      },
      includeFruitAuthors
    ]
  })
  return rawResponse.map(f => mapToFruitSummary(f))
}

export function createFruit (req, res) {
  res.send({
    message: 'This is the mockup controller for createFruit'
  })
}

export async function getFruitDetails (fruitId) {
  const rawResponse = await Fruit.findOne({
    where: {
      id: fruitId
    },
    include: [
      {
        model: Flower,
        required: true,
        attributes: ['title'],
        include: {
          model: Seed,
          required: true,
          attributes: ['id', 'title'],
          include: [
            includeSeedAuthors
          ]
        }
      },
      includeFruitAuthors
    ]
  })
  errorThrower(!checkExists(rawResponse), 'Flower not found', 404)
  return mapToFruitPublicDetail(rawResponse)
}

export function updateFruit (req, res) {
  res.send({
    message: 'This is the mockup controller for updateFruit'
  })
}

export function deleteFruit (req, res) {
  res.send({
    message: 'This is the mockup controller for deleteFruit'
  })
}

export function publishFruit (req, res) {
  res.send({
    message: 'This is the mockup controller for publishFruit'
  })
}
