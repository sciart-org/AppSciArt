import { errorThrower } from '../services/errorThrower.js'
import { checkIsStaff } from './userValidators.js'

const validateIsPublishedOrStaff = async (userId, product) => {
  return errorThrower(product.state !== 'PUBLISHED' && !(await checkIsStaff(userId)), 'Unauthorized: You cannot access this resource', 403)
}

export { validateIsPublishedOrStaff }
