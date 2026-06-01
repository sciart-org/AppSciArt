import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'
import { UserProfile } from '../models/UserProfile.js'
import { getUserRole, ROLES } from '../services/Roles.js'

export const getSeedRoleScope = (role, userId = undefined) => {
  if (role === ROLES.SCIENTIST) {
    return userId ? { method: ['scientist', userId] } : ROLES.PUBLIC.name
  }
  if (role === ROLES.EVALUATOR) {
    return ROLES.STAFF.name
  }
  return role.name
}

export const getSeedsOfEdition = async (editionId, { role, userId } = {}) => {
  role ??= await getUserRole(userId, { editionId })

  return Seed.scope([
    getSeedRoleScope(role, userId),
    { method: ['withEdition', editionId] },
    'withAuthors'
  ]).findAll({
    attributes: ['id', 'title', 'branchesOfKnowledge']
  })
}

export const getSeedsOfHackathon = async (hackathonId, { role, userId } = {}) => {
  role ??= await getUserRole(userId)
  return Seed.scope([
    getSeedRoleScope(role, userId),
    { method: ['withHackathon', hackathonId] }
  ]).findAll({
    attributes: ['id', 'title', 'state']
  })
}

export const getSeedById = async (seedId, { role, userId } = {}) => {
  role ??= await getUserRole(userId)
  return Seed.scope([getSeedRoleScope(role, userId), 'withAuthors']).findByPk(seedId)
}

export const getMinimalSeedById = async (seedId, { role, userId } = {}) => {
  role ??= await getUserRole(userId)
  return Seed.scope(getSeedRoleScope(role, userId)).findByPk(seedId, { attributes: ['id'] })
}

export const getSeedsOfScientist = async (scientistId, editionId, { role, userId } = {}) => {
  role ??= await getUserRole(userId, { editionId })

  return Seed.scope([getSeedRoleScope(role, userId), 'withAuthors']).findAll({
    attributes: ['id', 'title', 'state'],
    include: [
      {
        model: UserProfile,
        attributes: [],
        required: true,
        where: { id: scientistId },
        through: { attributes: [] }
      },
      ...(editionId
        ? [{
            model: Edition,
            attributes: [],
            required: true,
            where: { id: editionId },
            through: { attributes: [] }
          }]
        : [])
    ]
  })
}

export const countExistingSeedsWithAttributes = (attributes) => {
  return Seed.unscoped().count({ where: attributes })
}
