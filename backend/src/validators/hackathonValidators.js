import { Hackathon } from '../models/Hackathon.js'
import { errorThrower } from '../services/errorThrower.js'
import { combineIncludes, includeEditionName, includeIsEnrolled } from '../services/includes/hackathonIncludes.js'
import { checkExists } from './generalValidators.js'
import { checkIsStaff } from './userValidators.js'

const validateIsVisibleOrStaff = async (userId, hackathon) => {
  return errorThrower(hackathon.state === 'PLANNED' && !(await checkIsStaff(userId)), 'Unauthorized: You cannot access this hackathon', 401)
}

const validateHackathonExists = async (userId, hackathonId) => {
  const hackathon = await Hackathon.findByPk(
    hackathonId,
    combineIncludes([includeEditionName(), includeIsEnrolled(userId)])
  )
  errorThrower(!checkExists(hackathon), 'Hackathon not found', 404)
  return hackathon
}

const validateHackathonIsReadable = async (userId, hackathonId) => {
  const hackathon = await validateHackathonExists(userId, hackathonId)
  await validateIsVisibleOrStaff(userId, hackathon)
  return hackathon
}

const validateHackathonIsOpen = async (userId, hackathonId) => {
  const hackathon = await validateHackathonExists(userId, hackathonId)
  errorThrower(!(hackathon.state === 'OPEN'), 'Unauthorized: The hackathon is not open', 403)
  return hackathon
}

const validateHackathonNameUnique = async (internalName, editingHackathonId = null) => {
  const alreadyExists = await Hackathon.findOne({ where: { internalName }, attributes: ['id'] })
  errorThrower(alreadyExists && alreadyExists.id !== editingHackathonId, `Hackathon with name '${internalName}' already exists`, 409)
}

export { validateHackathonIsReadable, validateHackathonIsOpen, validateHackathonNameUnique }
