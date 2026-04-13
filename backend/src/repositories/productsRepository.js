import { ConceptualMap } from '../models/ConceptualMap.js'
import { Flower } from '../models/Flower.js'
import { Fruit } from '../models/Fruit.js'
import { Participation } from '../models/Participation.js'
import { Seed } from '../models/Seed.js'
import { UserProfile } from '../models/UserProfile.js'
import { includeSeedAuthors } from '../services/includes/productIncludes.js'

const getRoleScope = (isAdmin = false, userId = null) => {
  return isAdmin
    ? 'admin'
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
    attributes: ['id', 'title', 'mainImage']
  })
}

export const getSeedById = (seedId, userId, isAdmin) => {
  return Seed.scope(getRoleScope(isAdmin, userId)).findByPk(seedId)
}

export const getMinimalSeedUnrestricted = (seedId) => {
  return Seed.unscoped().findByPk(seedId, { attributes: ['id'] })
}

export const getMinimalSeedById = (seedId, userId, isAdmin) => {
  return Seed.scope(getRoleScope(isAdmin, userId)).findByPk(seedId, { attributes: ['id'] })
}

export const getMinimalParticipationOfUserInHackathon = (userId, hackathonId) => {
  return Participation.findOne({
    attributes: ['id'],
    where: {
      userProfileId: userId,
      hackathonId
    }
  })
}

export const getParticipationById = (participationId) => {
  return Participation.findByPk(participationId, {
    attributes: {
      exclude: ['interests', 'roles', 'userProfileId']
    },
    include: [{
      model: UserProfile,
      attributes: ['id', 'name', 'surname', 'email']
    }, {
      model: Fruit
    },
    {
      model: Flower,
      attributes: {
        exclude: ['title', 'mainImage', 'concept', 'conceptualMap', 'state', 'seedId']
      },
      include: {
        model: Seed,
        attributes: {
          exclude: ['template', 'state', 'branchesOfKnowledge']
        },
        include: includeSeedAuthors
      }
    },
    {
      model: ConceptualMap,
      attributes: {
        exclude: ['seedId']
      },
      include: {
        model: Seed,
        attributes: {
          exclude: ['template', 'state', 'branchesOfKnowledge']
        }
      }
    }
    ]
  })
}
