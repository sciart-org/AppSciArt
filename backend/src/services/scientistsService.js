import { checkIsInspiringScientist, checkIsStaff } from '../validators/userValidators.js'
import { errorThrower } from '../services/errorThrower.js'
import { Edition } from '../models/Edition.js'
import { UserProfile } from '../models/UserProfile.js'
import { Seed } from '../models/Seed.js'
import { EarlySignup } from '../models/EarlySignup.js'
import { checkExists } from '../validators/generalValidators.js'
import { ScientistInvitation } from '../models/roles/ScientistInvitation.js'
import * as emailService from '../emails/emailService.js'

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
  return await Seed.findAll({
    attributes: ['id', 'title', 'mainImage'],
    include: [
      {
        model: UserProfile,
        where: { id: userId },
        attributes: [],
        required: true
      },
      {
        model: Edition,
        where: { id: editionId },
        attributes: [],
        required: true
      }
    ]
  })
}

export async function getScientists (userId, editionId = null) {
  errorThrower(!(await checkIsStaff(userId)), 'Unauthorized: You cannot access this resource', 403)
  const whereClause = editionId ? { id: editionId } : undefined
  return await UserProfile.findAll({
    attributes: ['id', 'name', 'surname', 'email'],
    include: [
      {
        model: Edition,
        where: whereClause,
        through: { attributes: [] },
        attributes: ['name'],
        required: true
      }
    ]
  })
}

export async function inviteScientist (email, editionId, seedId) {
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
  const editions = await user.getEditions()
  const isAlreadyInvited = editions.map(e => e.id).includes(editionId)
  if (!isAlreadyInvited) {
    await user.addEdition(editionId)
  }
  if (seedId) {
    await user.addSeed(seedId)
  }
  return isAlreadyInvited
}

const inviteNonExistingUser = async (email, editionId, seedId) => {
  const isAlreadyInvited = await EarlySignup.findOne({ where: { email } })
  let earlySignUp = null
  if (!checkExists(isAlreadyInvited)) {
    earlySignUp = await EarlySignup.create({ email })
  }

  const scientistInvitation = await ScientistInvitation.findOne({ where: { email, seedId, editionId } })
  if (!checkExists(scientistInvitation)) {
    await ScientistInvitation.create({ email, seedId, editionId })
  }
  return earlySignUp?.id
}

export const completeScientistInvitationIfPresent = async (user) => {
  if (!checkExists(user?.email)) return
  const invitations = await ScientistInvitation.findAll({
    where: {
      email: user?.email
    }
  })
  for (const invitation of invitations) {
    await inviteExistingUser(user, invitation?.editionId, invitation?.seedId)
  }
  await ScientistInvitation.destroy({
    where: {
      email: user?.email
    }
  })
  return invitations.length > 0
}
