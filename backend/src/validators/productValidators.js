import { ConceptualMap } from '../models/ConceptualMap.js'
import { Flower } from '../models/Flower.js'
import { Fruit } from '../models/Fruit.js'
import { Hackathon } from '../models/Hackathon.js'
import { Seed } from '../models/Seed.js'
import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from './generalValidators.js'
import { checkIsStaff } from './userValidators.js'

const validateIsPublicOrStaff = async (userId, product) => {
  return errorThrower(product.state !== 'PUBLISHED' && !(await checkIsStaff(userId)), 'Unauthorized: You cannot access this resource', 403)
}

const hackathonInclude = (hackathonId) => ({
  model: Hackathon,
  required: true,
  attributes: [],
  where: { id: hackathonId },
  through: { attributes: [] }
})

const seedWithHackathonInclude = (hackathonId) => ({
  model: Seed,
  required: true,
  attributes: [],
  include: [hackathonInclude(hackathonId)]
})

export const validateConceptualMapIsFromHackathon = async (conceptualMapId, hackathonId) => {
  const conceptualMap = await ConceptualMap.findOne({
    where: { id: conceptualMapId },
    attributes: ['id'],
    limit: 1,
    include: [seedWithHackathonInclude(hackathonId)]
  })
  errorThrower(!checkExists(conceptualMap), 'This conceptual map does not belong to the current hackathon', 403)
}

export const validateFlowerIsFromHackathon = async (flowerId, hackathonId) => {
  const flower = await Flower.findOne({
    where: { id: flowerId },
    attributes: ['id'],
    limit: 1,
    include: [seedWithHackathonInclude(hackathonId)]
  })
  errorThrower(!checkExists(flower), 'This flower does not belong to the current hackathon', 403)
}

export const validateFruitIsFromHackathon = async (fruitId, hackathonId) => {
  const fruit = await Fruit.findOne({
    where: { id: fruitId },
    attributes: ['id'],
    limit: 1,
    include: [
      {
        model: Flower,
        required: true,
        attributes: [],
        include: [seedWithHackathonInclude(hackathonId)]
      }
    ]
  })
  errorThrower(!checkExists(fruit), 'This fruit does not belong to the current hackathon', 403)
}

export { validateIsPublicOrStaff }
