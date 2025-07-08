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
          attributes: []
        },
        attributes: []
      },
      includeAuthors
    ]
  })
  const response = rawResponse.map(s => {
    const seed = s.toJSON()
    return {
      ...seed,
      authors: seed.participations.map(is => is.user_profile),
      participations: undefined
    }
  })
  return response
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
