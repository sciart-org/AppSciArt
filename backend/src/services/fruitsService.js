import { Seed } from '../models/Seed.js'
import { Flower } from '../models/Flower.js'
import { Fruit } from '../models/Fruit.js'
import { errorThrower } from './errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'
import { validateEditionById } from '../validators/editionValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { validateIsPublishedOrStaff } from '../validators/productValidators.js'
import { mapToFruitPublicDetail, mapToFruitSummary } from './mappers/productMapper.js'
import { filterPublished, includeFruitAuthors, includeSeedAuthors, includeSeedsOfEdition } from './includes/productIncludes.js'

export async function getFruitsByEdition (userId, editionId) {
  await validateEditionById(userId, editionId)
  const showUnpublished = await checkIsStaff(userId)
  const rawResponse = await Fruit.findAll({
    where: showUnpublished ? {} : filterPublished,
    include: [
      {
        model: Flower,
        required: true,
        include: includeSeedsOfEdition(editionId),
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

export async function getFruitDetails (userId, fruitId) {
  const rawResponse = await Fruit.findByPk(fruitId, {
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
  errorThrower(!checkExists(rawResponse), 'Fruit not found', 404)
  const fruit = mapToFruitPublicDetail(rawResponse)
  await validateIsPublishedOrStaff(userId, fruit)
  return fruit
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
