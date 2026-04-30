import { Op } from 'sequelize'
import { Participation } from '../models/Participation.js'
import { Seed } from '../models/Seed.js'

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
    attributes: ['id', 'title', 'mainImage', 'state']
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
  return Participation.scope({ method: ['inHackathon', { hackathonId }] }).findOne({
    attributes: ['id'],
    where: { userProfileId: userId },
    include: []
  })
}

export const getMinimalParticipation = (participationId) => {
  return Participation.findByPk(participationId, {
    attributes: ['id', 'hackathonId'],
    include: []
  })
}

export const getParticipationById = (participationId) => {
  return Participation.scope('full').findByPk(participationId)
}

export const getMinimalParticipationsOfHackathon = (inHackathonAttributes) => {
  return Participation.scope({ method: ['inHackathon', inHackathonAttributes] }).findAll({
    attributes: ['id', 'groupId'],
    where: { groupId: { [Op.ne]: null } },
    include: []
  })
}

export const getParticipationsOfHackathon = (inHackathonAttributes) => {
  return Participation.scope({ method: ['inHackathon', inHackathonAttributes] }).findAll({
    where: { groupId: { [Op.ne]: null } }
  })
}

export const updateParticipationById = (participationId, body) => {
  return Participation.update(body, { where: { id: participationId } })
}

