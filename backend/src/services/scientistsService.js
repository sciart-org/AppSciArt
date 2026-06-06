import { checkIsInspiringScientist } from '../validators/userValidators.js'
import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'
import * as UsersRepository from '../repositories/usersRepository.js'
import * as AuthRepository from '../repositories/authRepository.js'
import * as ScientistsRepository from '../repositories/scientistsRepository.js'
import * as emailService from '../emails/emailService.js'
import * as SeedsRepository from '../repositories/seedsRepository.js'
import * as EditionsRepository from '../repositories/editionsRepository.js'
import { INTERNAL_BACKEND_ROLE, ROLES } from './Roles.js'
import { getFullSeedsDetails } from './seedsService.js'

export async function getScientistOpenEditions (userId) {
  errorThrower(!(await checkIsInspiringScientist(userId)), 'You are not an inspiring scientist', 403)
  return await ScientistsRepository.getEditionsOfScientist(userId, ['PLANNED'])
}

export async function getScientistSeedsOfEdition (userId, editionId) {
  errorThrower(!(await checkIsInspiringScientist(userId, { editionId })), 'You are not an inspiring scientist of this edition', 403)
  const seeds = await ScientistsRepository.getScientistSeedsOfEdition(userId, editionId, { userId })
  return await getFullSeedsDetails(seeds)
}

export async function getScientists (editionId = null) {
  const scientists = await ScientistsRepository.getScientistsOfEdition(editionId)
  return scientists
}

export async function inviteScientistByUserProfileId (userProfileId, editionId, seedId = undefined) {
  const userProfile = await UsersRepository.getUserProfileById(userProfileId)
  errorThrower(!checkExists(userProfile), 'User not found', 404)
  await inviteExistingUser(userProfile, editionId, seedId)
  return userProfile.email
}

export async function inviteScientistByEmail (email, editionId, seedId = undefined) {
  const userProfile = await UsersRepository.getUserProfileByEmail(email)

  if (checkExists(userProfile)) {
    await inviteExistingUser(userProfile, editionId, seedId)
    return
  }

  const earlySignUpId = await inviteNonExistingUser(email, editionId, seedId)
  return earlySignUpId
}

export async function sendScientistInvitationEmail (editionId, destinationEmail, sendEmail, earlySignUpId = undefined) {
  const edition = await EditionsRepository.getMinimalEdition(editionId, { role: INTERNAL_BACKEND_ROLE })
  const editionName = edition.name
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

export const modifyScientistEditions = async (scientistId, editions) => {
  for (const [editionId, value] of Object.entries(editions)) {
    await handleEditionEnrollment(scientistId, editionId, value)
  }
  return { message: 'Editions modified successfully' }
}

const handleEditionEnrollment = async (scientistId, editionId, toBeEnrolled) => {
  const edition = await EditionsRepository.getEditionDetails(editionId, { states: ['PLANNED', 'ACTIVE'], userId: scientistId })
  if (!checkExists(edition)) return
  const scientist = await UsersRepository.getMinimalUserProfile(scientistId)

  const scientistIsEnrolled = await ScientistsRepository.isScientistEnrolledToEdition(scientist, editionId)

  if (scientistIsEnrolled && !toBeEnrolled) {
    const seedsOfScientistInEdition = await SeedsRepository.getSeedsOfScientist(scientistId, { role: ROLES.STAFF })
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
