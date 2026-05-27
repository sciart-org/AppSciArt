import { errorThrower } from '../services/errorThrower.js'
import { INTERNAL_BACKEND_ROLE } from '../services/Roles.js'
import { checkExists } from './generalValidators.js'
import * as EditionsRepository from '../repositories/editionsRepository.js'

const validateCanSeeEdition = async (userId, editionId) => {
  const edition = await EditionsRepository.getMinimalEdition(editionId, { userId })
  errorThrower(!checkExists(edition), 'Edition not found', 404)
  return edition
}

const validateEditionNameUnique = async (name, editingEditionId = null) => {
  const alreadyExists = await EditionsRepository.getMinimalEditionByAttributes({ name }, { role: INTERNAL_BACKEND_ROLE })
  errorThrower(alreadyExists && alreadyExists.id !== editingEditionId, `Edition with name '${name}' already exists`, 409)
}

const validateIsActive = async (editionId, currentUserId) => {
  const edition = await EditionsRepository.getEditionDetails(editionId, { userId: currentUserId })
  errorThrower(!checkExists(edition), 'Edition not found', 404)
  errorThrower(edition.state !== 'ACTIVE', 'This edition is not active', 400)
  return edition
}

export { validateCanSeeEdition, validateEditionNameUnique, validateIsActive }
