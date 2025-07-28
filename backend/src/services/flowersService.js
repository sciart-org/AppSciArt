import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'
import { Flower } from '../models/Flower.js'
import { filterPublished, includeFlowerAuthors, includeSeedAuthors, mapToFlowerPublicDetail, mapToFlowerSummary } from './productUtils.js'

export async function getFlowersByEdition (editionId, showUnpublished) {
  const rawResponse = await Flower.findAll({
    where: showUnpublished ? {} : filterPublished,
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
      includeFlowerAuthors
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

export async function getFlowerDetails (flowerId) {
  const rawResponse = await Flower.findOne({
    where: {
      id: flowerId
    },
    include: [
      {
        model: Seed,
        required: true,
        attributes: ['id', 'title'],
        include: [
          includeSeedAuthors
        ]
      },
      includeFlowerAuthors
    ]
  })
  return mapToFlowerPublicDetail(rawResponse)
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
