import { Flower } from '../models/Flower.js'
import { getUserRole, ROLES } from '../services/Roles.js'

export const getFlowerRoleScope = (role) => {
  if (!role || role === ROLES.PUBLIC) return ROLES.PUBLIC.name
  return ROLES.STAFF.name
}

export const getFlowerWithSeedById = async (flowerId, { role, userId }) => {
  role ??= await getUserRole(userId)
  const scopes = [getFlowerRoleScope(role), 'withSeeds', 'withAuthors']
  return Flower.scope(scopes).findByPk(flowerId)
}

export const getFlowersOfEdition = async (editionId, { role, userId }) => {
  role ??= await getUserRole(userId)
  return Flower.scope([getFlowerRoleScope(role), 'withAuthors', { method: ['withSeedsOfEdition', editionId] }]).findAll({
    attributes: ['id', 'title', 'state']
  })
}

export const getFlowersOfHackathon = async (hackathonId, { role, userId }) => {
  role ??= await getUserRole(userId)

  const attributes = ['id', 'title', 'state']
  if (role === ROLES.STAFF || role === ROLES.EVALUATOR) {
    attributes.push('driveLink')
  }

  return Flower.scope([getFlowerRoleScope(role), 'withAuthors', { method: ['withSeedsOfHackathon', hackathonId] }]).findAll({
    attributes,
    order: [['createdAt', 'ASC']]
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

export const deleteFlower = (flowerId) => {
  return Flower.unscoped().destroy({
    where: {
      id: flowerId
    }
  })
}
