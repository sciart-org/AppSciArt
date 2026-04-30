import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from './generalValidators.js'
import { checkIsStaff } from './userValidators.js'
import * as HackathonRepository from '../repositories/hackathonsRepository.js'
import { Op } from 'sequelize'
import * as ProductsRepository from '../repositories/productsRepository.js'

const validateIsVisibleOrStaff = async (userId, hackathon) => {
  return errorThrower(hackathon.state === 'PLANNED' && !(await checkIsStaff(userId)), 'Unauthorized: You cannot access this hackathon', 401)
}

const validateHackathonExists = async (userId, hackathonId) => {
  const hackathon = await HackathonRepository.getHackathonById(userId, hackathonId, await checkIsStaff(userId))
  errorThrower(!checkExists(hackathon), 'Hackathon not found', 404)
  return hackathon
}

const validateCanEditHackathon = async (userId, hackathonId) => {
  const hackathon = await validateHackathonExists(userId, hackathonId)
  errorThrower(!(await checkIsStaff(userId)), 'Unauthorized: You cannot edit this hackathon', 403)
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
  const count = await HackathonRepository.countExistingHackathonsWithAttributes({
    internalName,
    ...(editingHackathonId && { id: { [Op.ne]: editingHackathonId } })
  })

  errorThrower(count > 0, `Hackathon with name '${internalName}' already exists`, 409)
}

const validateParticipantExists = async (userId, hackathonId) => {
  const participation = await ProductsRepository.getMinimalParticipationOfUserInHackathon(userId, { hackathonId })
  errorThrower(!checkExists(participation), 'Participation not found.', 404)
  return participation
}

export { validateHackathonIsReadable, validateHackathonIsOpen, validateHackathonNameUnique, validateCanEditHackathon, validateParticipantExists }
