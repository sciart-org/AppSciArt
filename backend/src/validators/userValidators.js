import { checkExists } from './generalValidators.js'
import { UserProfile } from '../models/UserProfile.js'
import { Edition } from '../models/Edition.js'
import { ROLES } from '../services/Roles.js'

const checkHasRoleById = async (userId, Model, { methodologyId, hackathonId } = {}) => {
  if (!checkExists(userId)) {
    return false
  }

  const isEvaluatorModel = ROLES.EVALUATOR.models.includes(Model)

  if (isEvaluatorModel && !hackathonId) {
    return false
  }

  const whereClause = isEvaluatorModel
    ? { userProfileId: userId, hackathonId }
    : { userProfileId: userId, ...(checkExists(methodologyId) && { methodologyId }) }

  const count = await Model.count({ where: whereClause })
  return count > 0
}

const checkIsInspiringScientist = async (userId, { methodologyId } = {}) => {
  if (!checkExists(userId)) {
    return false
  }

  const count = await UserProfile.count({
    where: {
      id: userId
    },
    include: [{
      model: Edition,
      required: true
      /*
      include: [{
        model: Methodology,
        required: true,
        where: {
          methodologyId
        }
      }]
      */
    }]
  })
  return (count > 0)
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
  return checkHasAnyRole(userId, Role.models, attributes)
}

export { checkHasRole, checkIsStaff, checkIsInspiringScientist }
