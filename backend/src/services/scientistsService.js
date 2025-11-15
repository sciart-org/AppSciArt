import { checkIsInspiringScientist, checkIsStaff } from '../validators/userValidators.js'
import { errorThrower } from '../services/errorThrower.js'
import { Edition } from '../models/Edition.js'
import { UserProfile } from '../models/UserProfile.js'
import { checkExists } from '../validators/generalValidators.js'
import { Op } from 'sequelize'
import * as usersRepository from '../repositories/usersRepository.js'
import * as authRepository from '../repositories/authRepository.js'
import * as scientistsRepository from '../repositories/scientistsRepository.js'
import * as emailService from '../emails/emailService.js'
import * as scientistsMappers from './mappers/scientistMapper.js'

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
  return await getScientistSeedsOfEdition(userId, editionId)
}

export async function getScientists (currentUserId, editionId = null) {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot access this resource', 403)
  const scientistOfNotClosedEditions = scientistsMappers.mapScientistsOfOpenEditions(
    await scientistsRepository.getScientistsOfOpenEditions(editionId)
  )
  const scientistOfClosedEditions = (await scientistsRepository.getScientistsOfClosedEditions(editionId)).map(s => s.toJSON())

  const mergedScientists = []
  for (const scientist of scientistsMappers.mapScientistEditions(scientistOfClosedEditions)) {
    mergedScientists.push(scientist)
  }

  for (const scientist of scientistOfNotClosedEditions) {
    const existing = mergedScientists.find(s => s.id === scientist.id)

    if (existing) {
      existing.editions = [...new Set([...existing.editions, ...(scientist.editions || [])])]
    } else {
      mergedScientists.push(scientist)
    }
  }
  return mergedScientists
}

export async function inviteScientist (currentUserId, email, editionId, seedId) {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot invite scientists', 403)
  const userProfile = await UserProfile.findOne({ where: { email } })
  const editionName = (await Edition.findByPk(editionId, { attributes: ['name'] })).name

  if (checkExists(userProfile)) {
    const isAlreadyInvited = await inviteExistingUser(userProfile, editionId, seedId)
    if (isAlreadyInvited) {
      // emailService.sendScientistInvitedEmail(email, editionName)
    }
    return
  }

  const earlySignUpId = await inviteNonExistingUser(email, editionId, seedId)
  if (checkExists(earlySignUpId)) {
    emailService.sendScientistPreRegistrationEmail(email, earlySignUpId, editionName)
  }
}

const inviteExistingUser = async (user, editionId, seedId) => {
  const isAlreadyInvited = await scientistsRepository.isScientistEnrolledToEdition(user, editionId)
  if (!isAlreadyInvited) {
    await scientistsRepository.addScientistToEdition(user, editionId)
  }
  if (seedId) {
    await scientistsRepository.addSeedToScientist(user, seedId)
  }
  return isAlreadyInvited
}

const inviteNonExistingUser = async (email, editionId, seedId) => {
  const isAlreadyInvited = await authRepository.getPreRegistration(email)
  let earlySignUp = null
  if (!checkExists(isAlreadyInvited)) {
    earlySignUp = await authRepository.preRegisterUser(email)
  }

  await scientistsRepository.getScientistInvitation(email, editionId, seedId)
  return earlySignUp?.id
}

export const completeScientistInvitationIfPresent = async (user) => {
  if (!checkExists(user?.email)) return
  const invitations = await scientistsRepository.getScientistInvitationsByUser(user)
  for (const invitation of invitations) {
    await inviteExistingUser(user, invitation?.editionId, invitation?.seedId)
  }
  await scientistsRepository.removeScientistInvitationsOfUser(user)
  return invitations.length > 0
}

export const modifyScientistEditions = async (currentUserId, scientistId, editions) => {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot update this resource', 403)
  const editionDesiredEnrollments = Object.entries(editions)
  for (const [key, value] of editionDesiredEnrollments) {
    await handleEditionEnrollment(scientistId, key, value)
  }
  return { message: 'Editions modified successfully' }
}

const handleEditionEnrollment = async (scientistId, editionId, toBeEnrolled) => {
  const edition = await Edition.findByPk(editionId, {
    where: { state: { [Op.notIn]: ['CLOSED', 'PUBLISHED'] } }
  })
  if (!checkExists(edition)) return
  const scientist = await usersRepository.getMinimalUser(scientistId)

  const scientistIsEnrolled = await scientistsRepository.isScientistEnrolledToEdition(scientist, editionId)

  if (scientistIsEnrolled && !toBeEnrolled) {
    await scientistsRepository.removeScientistFromEdition(scientist, editionId)
  } else if (!scientistIsEnrolled && toBeEnrolled) {
    await scientistsRepository.addScientistToEdition(scientist, editionId)
  }
}
