import { Op } from 'sequelize'
import { Hackathon } from '../models/Hackathon.js'
import { Evaluator } from '../models/roles/Evaluator.js'
import { UserProfile } from '../models/UserProfile.js'
import { getUserRole, ROLES } from '../services/Roles.js'

const userScope = (userId) => ['public', 'withEdition', { method: ['withEnrollment', userId] }]

const incomingWhere = () => ({ startDate: { [Op.gte]: new Date() } })
const ongoingWhere = () => {
  const now = new Date()
  return {
    startDate: { [Op.lte]: now },
    endDate: { [Op.gte]: now }
  }
}

const isStaff = (role) => role.name === ROLES.STAFF.name
const isEvaluator = (role) => role === ROLES.EVALUATOR.name

const getRoleScope = (role) => {
  return role.name
}

const withEnrollmentScope = (userId, role) => {
  return !isStaff(role) ? [{ method: ['withEnrollment', userId] }] : []
}

export const getClosestHackathon = (userId) =>
  Hackathon.scope(userScope(userId)).findOne({ where: incomingWhere() })

export const getIncomingHackathons = (userId) =>
  Hackathon.scope(userScope(userId)).findAll({ where: incomingWhere() })

export const getActiveHackathon = async (userId, role) => {
  role ??= await getUserRole(userId)
  const scopes = [
    getRoleScope(role),
    'withEdition',
    isStaff(role)
      ? 'withAllParticipations'
      : { method: ['withUserParticipation', userId] },
    ...withEnrollmentScope(userId, role)
  ]
  return Hackathon.scope(scopes).findOne({ subQuery: false, where: ongoingWhere() })
}

export const getHackathons = async (userId, hackathonId, role) => {
  role ??= await getUserRole(userId, { hackathonId })
  const scopes = [getRoleScope(role), 'withEdition', ...withEnrollmentScope(userId, role)]
  return Hackathon.scope(scopes).findAll()
}

export const getHackathonById = async (userId, hackathonId, role) => {
  role ??= await getUserRole(userId, { hackathonId })
  const scopes = [
    getRoleScope(role),
    'withEdition',
    isStaff(role)
      ? 'withAllParticipations'
      : { method: ['withEnrollment', userId] }
  ]

  return Hackathon.scope(scopes).findByPk(hackathonId)
}

export const countExistingHackathonsWithAttributes = (attributes) => {
  return Hackathon.count({ where: attributes })
}

export const createHackathon = (hackathonData) => {
  return Hackathon.create(hackathonData)
}

export const getEvaluatorsOfHackathon = (hackathonId) => {
  return Evaluator.findAll({
    where: { hackathonId },
    include: {
      model: UserProfile
    }
  })
}

export const getEvaluatorRolesOfUser = (userId) => {
  return Evaluator.findAll({
    where: { userProfileId: userId },
    include: {
      model: Hackathon.unscoped(),
      attributes: [],
      where: ongoingWhere(),
      required: true
    }
  })
}
