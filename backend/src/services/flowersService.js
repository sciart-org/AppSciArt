import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'
import { Flower } from '../models/Flower.js'

export async function getFlowersByEdition (editionId) {
  return await Flower.findAll({
    include: {
      model: Seed,
      required: true,
      include: {
        model: Edition,
        where: { id: editionId },
        attributes: []
      },
      attributes: []
    }
  })
}

export function createFlower (req, res) {
  res.send({
    message: 'This is the mockup controller for createFlower'
  })
}

export function getFlowerDetails (req, res) {
  res.send({
    message: 'This is the mockup controller for getFlowerDetails'
  })
}

export function updateFlower (req, res) {
  res.send({
    message: 'This is the mockup controller for updateFlower'
  })
}

export function deleteFlower (req, res) {
  res.send({
    message: 'This is the mockup controller for deleteFlower'
  })
}

export function publishFlower (req, res) {
  res.send({
    message: 'This is the mockup controller for publishFlower'
  })
}
