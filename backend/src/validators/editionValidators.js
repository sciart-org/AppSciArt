import { Edition } from '../models/Edition.js'
import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from './generalValidators.js'
import { checkIsStaff } from './userValidators.js'

const validateIsPublishedOrStaff = async (userId, edition) => {
  return errorThrower(!(edition.state === 'PUBLISHED') && !(await checkIsStaff(userId)), 'Unauthorized: You cannot access this edition', 401)
}

const validateEditionById = async (userId, editionId) => {
  const edition = await Edition.findByPk(editionId)
  errorThrower(!checkExists(edition), 'Edition not found', 404)
  await validateIsPublishedOrStaff(userId, edition)
  return edition
}

export { validateEditionById, validateIsPublishedOrStaff }
