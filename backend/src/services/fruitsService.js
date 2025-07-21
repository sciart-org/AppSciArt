import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'
import { Flower } from '../models/Flower.js'
import { Fruit } from '../models/Fruit.js'
import { Participation } from '../models/Participation.js'
import { UserProfile } from '../models/UserProfile.js'
import { InspiringScientist } from '../models/roles/InspiringScientist.js'

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

const includeSeedAuthors = {
  model: InspiringScientist,
  attributes: ['id'],
  through: { attributes: [] },
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

const mapToFruitPublicDetail = (rawFruit) => {
  const fruit = rawFruit.toJSON()
  return {
    id: fruit.id,
    title: fruit.title,
    mainImage: fruit.mainImage,
    authors: fruit.participations.map(is => is.user_profile),
    authorVision: fruit.authorVision,
    curatorVision: fruit.curatorVision,
    flower: {
      id: fruit.flowerId,
      title: fruit.flower.title
    },
    seed: {
      id: fruit.flower.seed.id,
      title: fruit.flower.seed.title,
      authors: fruit.flower.seed.inspiring_scientists.map(is => is.user_profile),
      description: fruit.seedDescription
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
      includeAuthors
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
