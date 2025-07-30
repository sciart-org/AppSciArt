import { Edition } from '../models/Edition.js'
import { Hackathon } from '../models/Hackathon.js'
import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from './generalValidators.js'
import { checkIsStaff } from './userValidators.js'

const validateIsVisibleOrStaff = async (req, resource) => {
  return errorThrower(!(resource.state === 'PUBLISHED') && !(await checkIsStaff(req)), 'Unauthorized: You cannot access this resource', 401)
}

const validateEditionById = async (req, editionId) => {
  const edition = await Edition.findByPk(editionId)
  errorThrower(!checkExists(edition), 'Edition not found', 404)
  await validateIsVisibleOrStaff(req, edition)
  return edition
}

const validateHackathonById = async (req, hackathonId) => {
  const hackathon = await Hackathon.findByPk(hackathonId)
  errorThrower(!checkExists(hackathon), 'Hackathon not found', 404)
  await validateIsVisibleOrStaff(req, hackathon)
  return hackathon
}

export { validateIsVisibleOrStaff, validateEditionById, validateHackathonById }
