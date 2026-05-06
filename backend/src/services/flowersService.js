import { errorThrower } from './errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'
import { validateCanSeeEdition } from '../validators/editionValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { validateIsPublicOrStaff } from '../validators/productValidators.js'
import * as FlowersRepository from '../repositories/flowersRepository.js'

export async function getFlowersByEdition (userId, editionId) {
  await validateCanSeeEdition(userId, editionId)
  const isAdmin = await checkIsStaff(userId)
  return await FlowersRepository.getFlowersOfEdition(editionId, isAdmin)
}

export function createFlower (req, res) {
  res.send({
    message: 'This is the mockup controller for createFlower'
  })
}

export async function getFlowerDetails (userId, flowerId) {
  const flower = await FlowersRepository.getFlowerWithSeedById(flowerId, false)
  errorThrower(!checkExists(flower), 'Flower not found', 404)
  await validateIsPublicOrStaff(userId, flower)
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
