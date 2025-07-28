import { errorThrower } from '../services/errorThrower.js'
import { checkIsStaff } from './userValidators.js'

const validateIsPublishedOrStaff = async (req, product) => {
  return errorThrower(product.state !== 'PUBLISHED' && !(await checkIsStaff(req)), 'Unauthorized: You cannot access this resource', 401)
}

export { validateIsPublishedOrStaff }
