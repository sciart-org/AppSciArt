import { Edition } from '../models/Edition.js'
import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from './generalValidators.js'
import { checkIsStaff } from './userValidators.js'

const validateIsPublishedOrStaff = async (userId, edition) => {
  return errorThrower(!(edition.state === 'PUBLISHED') && !(await checkIsStaff(userId)), 'Unauthorized: You cannot access this edition', 403)
}

const validateEditionExists = async (editionId) => {
  const edition = await Edition.findByPk(editionId)
  errorThrower(!checkExists(edition), 'Edition not found', 404)
  return edition
}

const validateCanSeeEdition = async (userId, editionId) => {
  const edition = await validateEditionExists(editionId)
  errorThrower(!userId && edition.state !== 'PUBLISHED', 'Authentication required', 401)
  await validateIsPublishedOrStaff(userId, edition)
  return edition
}

const validateEditionNameUnique = async (name, editingEditionId = null) => {
  const alreadyExists = await Edition.findOne({ where: { name }, attributes: ['id'] })
  errorThrower(alreadyExists && alreadyExists.id !== editingEditionId, `Edition with name '${name}' already exists`, 409)
}

export { validateCanSeeEdition, validateIsPublishedOrStaff, validateEditionNameUnique }
