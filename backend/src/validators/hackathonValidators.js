import { errorThrower } from '../services/errorThrower.js'
import { checkIsStaff } from './userValidators.js'

const validateIsVisibleOrStaff = async (req, hackathon) => {
  return errorThrower(!hackathon.isVisible && !(await checkIsStaff(req)), 'Unauthorized: You cannot access this resource', 401)
}

export { validateIsVisibleOrStaff }
