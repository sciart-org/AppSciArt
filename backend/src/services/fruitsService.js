import { Seed } from '../models/Seed.js'
import { Flower } from '../models/Flower.js'
import { Fruit } from '../models/Fruit.js'
import { errorThrower } from './errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'
import { validateCanSeeEdition } from '../validators/editionValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { validateIsPublicOrStaff } from '../validators/productValidators.js'
import { filterPublished, includeFruitAuthors, includeSeedAuthors, includeSeedsOfEdition } from './includes/productIncludes.js'

export async function getFruitsByEdition (userId, editionId) {
  await validateCanSeeEdition(userId, editionId)
  const showUnpublished = await checkIsStaff(userId)
  return await Fruit.findAll({
    where: showUnpublished ? {} : filterPublished,
    attributes: ['id', 'title', 'state'],
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
}

export function createFruit (req, res) {
  res.send({
    message: 'This is the mockup controller for createFruit'
  })
}

export async function getFruitDetails (userId, fruitId) {
  const fruit = await Fruit.findByPk(fruitId, {
    attributes: {
      exclude: ['driveLink', 'flowerId']
    },
    include: [
      {
        model: Flower,
        required: true,
        attributes: ['id', 'title'],
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
  errorThrower(!checkExists(fruit), 'Fruit not found', 404)
  await validateIsPublicOrStaff(userId, fruit)
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
