import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'
import { Flower } from '../models/Flower.js'
import { Fruit } from '../models/Fruit.js'
import { includeFruitAuthors, includeSeedAuthors, mapToFruitPublicDetail, mapToFruitSummary } from './productUtils.js'

export async function getFruitsByEdition (editionId) {
  const rawResponse = await Fruit.findAll({
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
