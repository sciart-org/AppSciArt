import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'
import { getUserRole, ROLES } from '../services/Roles.js'

const EDIION_SCOPE_BY_ROLE = new Map([
  [ROLES.PUBLIC, ROLES.PUBLIC],
  [ROLES.PARTICIPANT, ROLES.PUBLIC],
  [ROLES.EVALUATOR, ROLES.STAFF],
  [ROLES.SCIENTIST, ROLES.STAFF],
  [ROLES.STAFF, ROLES.STAFF]
])

export const getRoleScope = (role) =>
  EDIION_SCOPE_BY_ROLE.get(role)?.name ?? ROLES.PUBLIC.name

export const getEditions = async ({ states = [], role, userId } = {}) => {
  role ??= await getUserRole(userId)
  const scopes = [getRoleScope(role)]
  if (states?.length > 0) scopes.push({ method: ['inState', states] })
  return Edition.scope(scopes).findAll()
}

export const getEditionDetails = async (editionId, { states = [], role, userId } = {}) => {
  role ??= await getUserRole(userId)
  const scopes = [getRoleScope(role), 'withFruits', 'detail']
  if (states?.length > 0) scopes.push({ method: ['inState', states] })
  return Edition.scope(scopes).findByPk(editionId)
}

export const getMinimalEdition = async (editionId, { role, userId }) => {
  role ??= await getUserRole(userId)
  return Edition.scope([getRoleScope(role)]).findByPk(editionId, {
    attributes: ['id', 'name', 'state']
  })
}

export const getMinimalEditionByAttributes = async (attributes, { role, userId }) => {
  role ??= await getUserRole(userId)
  return Edition.scope([getRoleScope(role)]).findOne({
    where: attributes,
    attributes: ['id', 'name']
  })
}

export const getEditionsOfSeed = async (seedId, { role, userId }) => {
  role ??= await getUserRole(userId)
  return Edition.scope([getRoleScope(role)]).findAll({
    include: {
      model: Seed.scope([getRoleScope(role)]),
      where: { id: seedId },
      attributes: [],
      through: { attributes: [] }
    }
  })
}
