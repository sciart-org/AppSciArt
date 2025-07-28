import { checkExists } from './generalValidators.js'
import * as UsersService from '../services/usersService.js'
import { Administrator } from '../models/roles/Administrator.js'
import { Designer } from '../models/roles/Designer.js'
import { Evaluator } from '../models/roles/Evaluator.js'
import { Facilitator } from '../models/roles/Facilitator.js'

const checkHasRole = async (req, Role, methodologyId) => {
  const user = await UsersService.getCurrentUserProfile(req)
  return await checkHasRoleById(user?.id, Role, methodologyId)
}

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

const checkHasAnyRole = async (req, roles, methodologyId) => {
  for (const r of roles) {
    const hasRole = await checkHasRole(req, r, methodologyId)
    if (hasRole) return true
  }
  return false
}

const checkIsStaff = async (req, methodologyId) => {
  return checkHasAnyRole(req, [Administrator, Designer, Evaluator, Facilitator], methodologyId)
}

export { checkHasRole, checkHasRoleById, checkHasAnyRole, checkIsStaff }
