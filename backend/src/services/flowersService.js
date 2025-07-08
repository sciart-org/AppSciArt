import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'
import { Flower } from '../models/Flower.js'
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

export async function getFlowersByEdition (editionId) {
  const rawResponse = await Flower.findAll({
    include: [
      {
        model: Seed,
        required: true,
        include: {
          model: Edition,
          where: { id: editionId },
          attributes: []
        },
        attributes: []
      },
      includeAuthors
    ]
  }
  )
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
