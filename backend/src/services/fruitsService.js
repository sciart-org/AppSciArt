import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'
import { Flower } from '../models/Flower.js'
import { Fruit } from '../models/Fruit.js'
import { Participation } from '../models/Participation.js'
import { UserProfile } from '../models/UserProfile.js'

const includeAuthors = {
  model: Participation,
  attributes: ['id'],
  include: [
    {
      model: UserProfile,
      attributes: ['name', 'surname']
    }
  ]
}

const mapToFruitSummary = (rawFruit) => {
  const fruit = rawFruit.toJSON()
  return {
    id: fruit.id,
    title: fruit.title,
    mainImage: fruit.mainImage,
    authors: fruit.participations.map(is => is.user_profile),
    seed: {
      id: fruit.flower.seed.id,
      title: fruit.flower.seed.title
    }
  }
}

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
      includeAuthors
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
  return await Fruit.findOne({
    where: {
      id: fruitId
    }
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
