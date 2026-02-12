import { Edition } from '../models/Edition.js'
import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from './generalValidators.js'
import { checkIsStaff } from './userValidators.js'

const validateIsPublicOrStaff = async (userId, edition) => {
  return errorThrower(!(edition.state !== 'PLANNED') && !(await checkIsStaff(userId)), 'Unauthorized: You cannot access this edition', 403)
}

const validateEditionExists = async (editionId) => {
  const edition = await Edition.findByPk(editionId)
  errorThrower(!checkExists(edition), 'Edition not found', 404)
  return edition
}

const validateCanSeeEdition = async (userId, editionId) => {
  const edition = await validateEditionExists(editionId)
  await validateIsPublicOrStaff(userId, edition)
  return edition
}

const validateCanEditEdition = async (userId, editionId) => {
  const edition = await validateEditionExists(editionId)
  errorThrower(!(await checkIsStaff(userId)), 'Unauthorized: You cannot edit this edition', 403)
  return edition
}

const validateEditionNameUnique = async (name, editingEditionId = null) => {
  const alreadyExists = await Edition.findOne({ where: { name }, attributes: ['id'] })
  errorThrower(alreadyExists && alreadyExists.id !== editingEditionId, `Edition with name '${name}' already exists`, 409)
}

const validateCanBeAnnounced = async (userId, editionId) => {
  const edition = await validateCanEditEdition(userId, editionId)
  errorThrower(edition.state !== 'PLANNED', 'This edition is already announced', 400)
  return edition
}

const validateIsActive = async (editionId) => {
  const edition = await validateEditionExists(editionId)
  errorThrower(edition.state !== 'ACTIVE', 'This edition is not active', 400)
  return edition
}

export { validateCanSeeEdition, validateCanEditEdition, validateIsPublicOrStaff, validateEditionNameUnique, validateCanBeAnnounced, validateIsActive }
