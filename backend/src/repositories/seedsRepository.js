import { Edition } from '../models/Edition.js'
import { Seed } from '../models/Seed.js'
import { UserProfile } from '../models/UserProfile.js'

const getRoleScope = (isAdmin = false, userId = null) => {
  return isAdmin
    ? 'staff'
    : userId
      ? { method: ['scientist', userId] }
      : 'public'
}

export const getSeedsOfEdition = async (editionId, isAdmin) => {
  return Seed.scope([
    getRoleScope(isAdmin),
    { method: ['withEdition', editionId] },
    'withAuthors'
  ]).findAll({
    attributes: ['id', 'title', 'mainImage', 'branchesOfKnowledge']
  })
}

export const getSeedsOfHackathon = (hackathonId, isAdmin) => {
  return Seed.scope([
    getRoleScope(isAdmin),
    { method: ['withHackathon', hackathonId] }
  ]).findAll({
    attributes: ['id', 'title', 'mainImage', 'state']
  })
}

export const getSeedById = (seedId, userId, isAdmin) => {
  return Seed.scope([getRoleScope(isAdmin, userId), 'withAuthors']).findByPk(seedId)
}

export const getMinimalSeedUnrestricted = (seedId) => {
  return Seed.unscoped().findByPk(seedId, { attributes: ['id'] })
}

export const getMinimalSeedById = (seedId, userId, isAdmin) => {
  return Seed.scope(getRoleScope(isAdmin, userId)).findByPk(seedId, { attributes: ['id'] })
}

export const getSeedsOfScientist = (userProfileId, editionId, isAdmin) => {
  return Seed.scope([getRoleScope(isAdmin), 'withAuthors']).findAll({
    attributes: ['id', 'title', 'mainImage', 'state'],
    include: [
      {
        model: UserProfile,
        attributes: [],
        required: true,
        where: { id: userProfileId },
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
