import { Flower } from '../models/Flower.js'

const getRoleScope = (isAdmin = false) => {
  return isAdmin
    ? 'admin'
    : 'public'
}

export const getFlowerWithSeedById = (flowerId, isAdmin = false) => {
  return Flower.scope([getRoleScope(isAdmin), 'withSeeds', 'withAuthors']).findByPk(flowerId)
}

export const getFlowersOfEdition = (editionId, isAdmin) => {
  return Flower.scope([getRoleScope(isAdmin), 'withAuthors', { method: ['withSeedsOfEdition', editionId] }]).findAll({
    attributes: ['id', 'title', 'mainImage', 'state']
  })
}

export const getFlowersOfHackathon = (hackathonId, isAdmin) => {
  return Flower.scope([getRoleScope(isAdmin), 'withAuthors', { method: ['withSeedsOfHackathon', hackathonId] }]).findAll({
    attributes: ['id', 'title', 'mainImage', 'state']
  })
}

export const getFlowerWithHackathonSeed = (flowerId, hackathonId) => {
  return Flower.scope({ method: ['withSeedsOfHackathon', hackathonId] }).findOne({
    where: { id: flowerId }
  })
}

export const getMinimalFlowerUnrestricted = (flowerId) => {
  return Flower.unscoped().findByPk(flowerId, { attributes: ['id'] })
}

export const createFlowerOfSeed = (seedId) => {
  return Flower.create({ seedId })
}

export const getFlowerOfSeedInHackathon = (seedId, hackathonId) => {
  return Flower.scope({ method: ['withSeedsOfHackathon', hackathonId] }).findOne({
    where: { seedId }
  })
}
