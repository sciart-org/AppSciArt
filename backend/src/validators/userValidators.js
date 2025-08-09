import { checkExists } from './generalValidators.js'
import { Administrator } from '../models/roles/Administrator.js'
import { Designer } from '../models/roles/Designer.js'
import { Evaluator } from '../models/roles/Evaluator.js'
import { Facilitator } from '../models/roles/Facilitator.js'

const checkHasRoleById = async (userId, Role, methodologyId) => {
  if (!checkExists(userId)) {
    return false
  }

  const whereClause = checkExists(methodologyId) ? { userProfileId: userId, methodologyId } : { userProfileId: userId }
  const count = await Role.count({
    where: whereClause
  })
  return (count > 0)
}

const checkHasAnyRole = async (userId, roles, methodologyId) => {
  for (const r of roles) {
    const hasRole = await checkHasRoleById(userId, r, methodologyId)
    if (hasRole) return true
  }
  return false
}

const checkIsStaff = async (userId, methodologyId) => {
  return checkHasAnyRole(userId, [Administrator, Designer, Evaluator, Facilitator], methodologyId)
}

export { checkHasRoleById, checkHasAnyRole, checkIsStaff }
