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

const mapToFlowerSummary = (rawFlower) => {
  const flower = rawFlower.toJSON()
  return {
    id: flower.id,
    title: flower.title,
    mainImage: flower.mainImage,
    authors: flower.participations.map(is => is.user_profile),
    seed: {
      id: flower.seedId,
      title: flower.seed.title
    }
  }
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
        attributes: ['title']
      },
      includeAuthors
    ]
  }
  )
  return rawResponse.map(f => mapToFlowerSummary(f))
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
