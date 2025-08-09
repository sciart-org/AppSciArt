import { Hackathon } from '../models/Hackathon.js'
import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from './generalValidators.js'
import { checkIsStaff } from './userValidators.js'

const validateIsVisibleOrStaff = async (userId, hackathon) => {
  return errorThrower(!hackathon.isVisible && !(await checkIsStaff(userId)), 'Unauthorized: You cannot access this hackathon', 401)
}

const validateHackathonById = async (userId, hackathonId) => {
  const hackathon = await Hackathon.findByPk(hackathonId)
  errorThrower(!checkExists(hackathon), 'Hackathon not found', 404)
  await validateIsVisibleOrStaff(userId, hackathon)
  return hackathon
}

export { validateHackathonById }
