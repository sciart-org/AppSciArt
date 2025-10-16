import { Seed } from '../models/Seed.js'
import { Flower } from '../models/Flower.js'
import { errorThrower } from './errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'
import { validateEditionById } from '../validators/editionValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { validateIsPublishedOrStaff } from '../validators/productValidators.js'
import { mapFlowerAuthors } from './mappers/productMapper.js'
import { includeSeedsOfEdition, filterPublished, includeFlowerAuthors, includeSeedAuthors } from './includes/productIncludes.js'

export async function getFlowersByEdition (userId, editionId) {
  await validateEditionById(userId, editionId)
  const showUnpublished = await checkIsStaff(userId)
  const rawResponse = await Flower.findAll({
    where: showUnpublished ? {} : filterPublished,
    attributes: ['id', 'title', 'mainImage', 'state'],
    include: [
      includeSeedsOfEdition(editionId),
      includeFlowerAuthors
    ]
  }
  )
  return rawResponse.map(f => mapFlowerAuthors(f))
}

export function createFlower (req, res) {
  res.send({
    message: 'This is the mockup controller for createFlower'
  })
}

export async function getFlowerDetails (userId, flowerId) {
  const rawResponse = await Flower.findByPk(flowerId, {
    attributes: {
      exclude: ['template', 'conceptualMap', 'driveLink', 'seedId']
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
  errorThrower(!checkExists(rawResponse), 'Flower not found', 404)
  const flower = mapFlowerAuthors(rawResponse)
  await validateIsPublishedOrStaff(userId, flower)
  return flower
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
