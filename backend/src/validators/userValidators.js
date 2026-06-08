import { checkExists } from './generalValidators.js'
import { ROLES } from '../services/Roles.js'
import * as ScientistsRepository from '../repositories/scientistsRepository.js'
import * as ParticipationsRepository from '../repositories/participationsRepository.js'

const checkHasRoleById = async (userId, Model, { hackathonId } = {}) => {
  if (!checkExists(userId)) {
    return false
  }

  const isEvaluatorModel = ROLES.EVALUATOR.models.includes(Model)

  if (isEvaluatorModel && !hackathonId) {
    return false
  }

  const whereClause = isEvaluatorModel
    ? { userProfileId: userId, hackathonId }
    : { userProfileId: userId }

  const count = await Model.count({ where: whereClause })
  return count > 0
}

const checkIsInspiringScientist = async (userId, { editionId } = {}) => {
  if (!checkExists(userId)) {
    return false
  }
  const editions = await ScientistsRepository.getEditionsOfScientist(userId)
  return editionId
    ? editions.some(e => e.id === editionId)
    : editions.length > 0
}

const checkIsParticipantOfHackathon = async (userId, { hackathonId } = {}) => {
  if (!checkExists(userId)) {
    return false
  }
  const participation = await ParticipationsRepository.getMinimalParticipationOfUserInHackathon(userId, { hackathonId })
  return !!participation
}

const checkHasAnyRole = async (userId, roles, { methodologyId, hackathonId } = {}) => {
  const results = await Promise.all(
    roles.map(role => checkHasRoleById(userId, role, { methodologyId, hackathonId }))
  )
  return results.some(Boolean)
}

const checkIsStaff = async (userId, { methodologyId } = {}) => {
  return checkHasRole(userId, ROLES.STAFF, { methodologyId })
}

const checkHasRole = async (userId, Role, attributes = {}) => {
  if (Role === ROLES.SCIENTIST) {
    return checkIsInspiringScientist(userId, attributes)
  }
  if (Role === ROLES.PARTICIPANT) {
    return checkIsParticipantOfHackathon(userId, attributes)
  }
  return checkHasAnyRole(userId, Role.models, attributes)
}

export { checkHasRole, checkIsStaff, checkIsInspiringScientist }
