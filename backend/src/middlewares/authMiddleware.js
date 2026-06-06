import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'
import { checkIsStaff } from '../validators/userValidators.js'
import * as UsersService from '../services/usersService.js'

export const validateStaff = async (req) => {
  const currentUser = await validateAuthenticated(req)
  const isStaff = await checkIsStaff(currentUser.id)
  errorThrower(!isStaff, 'Unauthorized: You cannot perform this action', 403)
  return currentUser
}

export const validateAuthenticated = async (req) => {
  const currentUser = await UsersService.getCurrentUserProfile(req)
  errorThrower(!checkExists(currentUser), 'Authentication required', 401)
  return currentUser
}
