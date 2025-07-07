import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'
import { Flower } from '../models/Flower.js'
import { Fruit } from '../models/Fruit.js'

export async function getFruitsByEdition (editionId) {
  return await Fruit.findAll({
    include: {
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
        attributes: []
      },
      attributes: []
    }
  })
}

export function createFruit (req, res) {
  res.send({
    message: 'This is the mockup controller for createFruit'
  })
}

export function getFruitDetails (req, res) {
  res.send({
    message: 'This is the mockup controller for getFruitDetails'
  })
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
