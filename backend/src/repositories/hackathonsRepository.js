import { Op } from 'sequelize'
import { Hackathon } from '../models/Hackathon.js'

const userScope = (userId) => ['public', 'withEdition', { method: ['withEnrollment', userId] }]

const incomingWhere = () => ({ startDate: { [Op.gte]: new Date() } })
const ongoingWhere = () => {
  const now = new Date()
  return {
    startDate: { [Op.lte]: now },
    endDate: { [Op.gte]: now }
  }
}

const getRoleScope = (isAdmin = false) => isAdmin ? 'admin' : 'public'

export const getClosestHackathon = (userId) =>
  Hackathon.scope(userScope(userId)).findOne({ where: incomingWhere() })

export const getIncomingHackathons = (userId) =>
  Hackathon.scope(userScope(userId)).findAll({ where: incomingWhere() })

export const getActiveHackathon = (userId, isAdmin) => {
  const scopes = [
    getRoleScope(isAdmin),
    'withEdition',
    isAdmin ? 'withAllParticipations' : { method: ['withUserParticipation', userId] }
  ]
  if (!isAdmin) {
    scopes.push({ method: ['withEnrollment', userId] })
  }

  return Hackathon.scope(scopes).findOne({
    subQuery: false,
    where: ongoingWhere()
  })
}

export const getHackathons = (userId, isAdmin) => {
  const scopes = [
    getRoleScope(isAdmin),
    'withEdition'
  ]
  if (!isAdmin) {
    scopes.push({ method: ['withEnrollment', userId] })
  }

  return Hackathon.scope(scopes).findAll()
}

export const getHackathonById = (userId, hackathonId, isAdmin) => {
  const scopes = [
    getRoleScope(isAdmin),
    'withEdition'
  ]

  if (!isAdmin) {
    scopes.push({ method: ['withEnrollment', userId] })
  } else {
    scopes.push('withAllParticipations')
  }

  return Hackathon.scope(scopes).findByPk(hackathonId)
}

export const countExistingHackathonsWithAttributes = (attributes) => {
  return Hackathon.count({ where: attributes })
}

export const createHackathon = (hackathonData) => {
  return Hackathon.create(hackathonData)
}
