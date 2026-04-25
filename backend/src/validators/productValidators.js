import { Flower } from '../models/Flower.js'
import { Fruit } from '../models/Fruit.js'
import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from './generalValidators.js'
import { checkIsStaff } from './userValidators.js'
import * as GroupsAndTeamsRepository from '../repositories/groupsAndTeamsRepository.js'

const validateIsPublicOrStaff = async (userId, product) => {
  return errorThrower(product.state !== 'PUBLISHED' && !(await checkIsStaff(userId)), 'Unauthorized: You cannot access this resource', 403)
}

export const validateConceptualMapIsFromHackathon = async (conceptualMapId, hackathonId) => {
  const conceptualMap = await GroupsAndTeamsRepository.getConceptualMapOfHackathon(conceptualMapId, hackathonId)
  errorThrower(!checkExists(conceptualMap), 'This conceptual map does not belong to the current hackathon', 403)
}

export const validateFlowerIsFromHackathon = async (flowerId, hackathonId) => {
  const flower = await Flower.scope({ method: ['withSeedsOfHackathon', hackathonId] }).findOne({
    where: { id: flowerId }
  })
  errorThrower(!checkExists(flower), 'This flower does not belong to the current hackathon', 403)
}

export const validateFruitIsFromHackathon = async (fruitId, hackathonId) => {
  const fruit = await Fruit.findOne({
    where: { id: fruitId },
    attributes: ['id'],
    include: [
      {
        model: Flower.scope({ method: ['withSeedsOfHackathon', hackathonId] })
      }
    ]
  })
  errorThrower(!checkExists(fruit), 'This fruit does not belong to the current hackathon', 403)
}

export { validateIsPublicOrStaff }
