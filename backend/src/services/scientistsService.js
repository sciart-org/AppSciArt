import { checkIsInspiringScientist, checkIsStaff } from '../validators/userValidators.js'
import { errorThrower } from '../services/errorThrower.js'
import { Edition } from '../models/Edition.js'
import { UserProfile } from '../models/UserProfile.js'
import { checkExists } from '../validators/generalValidators.js'
import { Op } from 'sequelize'
import * as UsersRepository from '../repositories/usersRepository.js'
import * as AuthRepository from '../repositories/authRepository.js'
import * as ScientistsRepository from '../repositories/scientistsRepository.js'
import * as emailService from '../emails/emailService.js'
import * as SeedsRepository from '../repositories/seedsRepository.js'

export async function getScientistOpenEditions (userId) {
  errorThrower(!(await checkIsInspiringScientist(userId)), 'You are not an inspiring scientist', 403)
  return await Edition.findAll({
    where: {
      state: 'PLANNED'
    },
    include: [
      {
        model: UserProfile,
        where: { id: userId },
        attributes: [],
        required: true
      }
    ]
  })
}

export async function getScientistSeedsOfEdition (userId, editionId) {
  errorThrower(!(await checkIsInspiringScientist(userId)), 'You are not an inspiring scientist', 403)
  return await ScientistsRepository.getScientistSeedsOfEdition(userId, editionId)
}

export async function getScientists (currentUserId, editionId = null) {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot access this resource', 403)
  const scientists = await ScientistsRepository.getScientistsOfEdition(editionId)
  return scientists
}

export async function inviteScientistByUserProfileId (currentUserId, userProfileId, editionId, seedId = undefined) {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot invite scientists', 403)
  const userProfile = await UsersRepository.getUserProfileById(userProfileId)
  errorThrower(!checkExists(userProfile), 'User not found', 404)
  await inviteExistingUser(userProfile, editionId, seedId)
  return userProfile.email
}

export async function inviteScientistByEmail (currentUserId, email, editionId, seedId = undefined) {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot invite scientists', 403)
  const userProfile = await UsersRepository.getUserProfileByEmail(email)

  if (checkExists(userProfile)) {
    await inviteExistingUser(userProfile, editionId, seedId)
    return
  }

  const earlySignUpId = await inviteNonExistingUser(email, editionId, seedId)
  return earlySignUpId
}

export async function sendScientistInvitationEmail (editionId, destinationEmail, sendEmail, earlySignUpId = undefined) {
  const editionName = (await Edition.findByPk(editionId, { attributes: ['name'] })).name
  if (checkExists(earlySignUpId)) {
    return emailService.sendScientistPreRegistrationEmail(destinationEmail, earlySignUpId, editionName)
  }
  if (sendEmail) {
    // return emailService.sendScientistInvitedEmail(destinationEmail, editionName)
  }
}

const inviteExistingUser = async (user, editionId, seedId) => {
  const isAlreadyInvited = await ScientistsRepository.isScientistEnrolledToEdition(user, editionId)
  if (!isAlreadyInvited) {
    await ScientistsRepository.addScientistToEdition(user, editionId)
  }
  if (checkExists(seedId)) {
    await ScientistsRepository.addSeedToScientist(user, seedId)
  }
}

const inviteNonExistingUser = async (email, editionId, seedId) => {
  const isAlreadyInvited = await AuthRepository.getPreRegistration(email)
  let earlySignUp = null
  if (!checkExists(isAlreadyInvited)) {
    earlySignUp = await AuthRepository.preRegisterUser(email)
  }

  await ScientistsRepository.getScientistInvitation(email, editionId, seedId)
  return earlySignUp?.id
}

export const completeScientistInvitationIfPresent = async (user) => {
  if (!checkExists(user?.email)) return
  const invitations = await ScientistsRepository.getScientistInvitationsByUser(user)
  for (const invitation of invitations) {
    await inviteExistingUser(user, invitation?.editionId, invitation?.seedId)
  }
  await ScientistsRepository.removeScientistInvitationsOfUser(user)
  return invitations.length > 0
}

export const modifyScientistEditions = async (currentUserId, scientistId, editions) => {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot update this resource', 403)
  for (const [editionId, value] of Object.entries(editions)) {
    await handleEditionEnrollment(scientistId, editionId, value)
  }
  return { message: 'Editions modified successfully' }
}

const handleEditionEnrollment = async (scientistId, editionId, toBeEnrolled) => {
  const edition = await Edition.findByPk(editionId, {
    where: { state: { [Op.notIn]: ['CLOSED', 'PUBLISHED'] } }
  })
  if (!checkExists(edition)) return
  const scientist = await UsersRepository.getMinimalUserProfile(scientistId)

  const scientistIsEnrolled = await ScientistsRepository.isScientistEnrolledToEdition(scientist, editionId)

  if (scientistIsEnrolled && !toBeEnrolled) {
    const seedsOfScientistInEdition = await SeedsRepository.getSeedsOfScientist(scientistId, editionId, true)
    errorThrower(
      checkExists(seedsOfScientistInEdition),
      'This scientist has already created seeds in this edition',
      409
    )
    await ScientistsRepository.removeScientistFromEdition(scientist, editionId)
  } else if (!scientistIsEnrolled && toBeEnrolled) {
    await ScientistsRepository.addScientistToEdition(scientist, editionId)
  }
}
