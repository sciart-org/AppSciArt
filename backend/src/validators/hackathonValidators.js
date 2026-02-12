import { Hackathon } from '../models/Hackathon.js'
import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from './generalValidators.js'
import { checkIsStaff } from './userValidators.js'

const validateIsVisibleOrStaff = async (userId, hackathon) => {
  return errorThrower(hackathon.state === 'PLANNED' && !(await checkIsStaff(userId)), 'Unauthorized: You cannot access this hackathon', 401)
}

const validateHackathonIsReadable = async (userId, hackathonId) => {
  const hackathon = await Hackathon.findByPk(hackathonId)
  errorThrower(!checkExists(hackathon), 'Hackathon not found', 404)
  await validateIsVisibleOrStaff(userId, hackathon)
  return hackathon
}

const validateHackathonIsOpen = async (userId, hackathonId) => {
  const hackathon = await Hackathon.findByPk(hackathonId)
  errorThrower(!checkExists(hackathon), 'Hackathon not found', 404)
  errorThrower(!(hackathon.state === 'OPEN'), 'Unauthorized: The hackathon is not open', 403)
  return hackathon
}

const validateHackathonNameUnique = async (internalName, editingHackathonId = null) => {
  const alreadyExists = await Hackathon.findOne({ where: { internalName }, attributes: ['id'] })
  errorThrower(alreadyExists && alreadyExists.id !== editingHackathonId, `Hackathon with name '${internalName}' already exists`, 409)
}

export { validateHackathonIsReadable, validateHackathonIsOpen, validateHackathonNameUnique }
