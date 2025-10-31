import { checkIsInspiringScientist } from '../validators/userValidators.js'
import { errorThrower } from '../services/errorThrower.js'
import { Edition } from '../models/Edition.js'
import { UserProfile } from '../models/UserProfile.js'
import { Seed } from '../models/Seed.js'
import { EarlySignup } from '../models/EarlySignup.js'
import { checkExists } from '../validators/generalValidators.js'
import { ScientistInvitation } from '../models/roles/ScientistInvitation.js'

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
export async function inviteScientist (email, editionId, seed) {
  const userProfile = await UserProfile.findOne({ where: { email } })
  if (checkExists(userProfile)) {
    await userProfile.addSeed(seed)
    // send invitation email
    return
  }

  const earlySignup = await EarlySignup.findOne({ where: { email } })
  if (!checkExists(earlySignup)) {
    await EarlySignup.create({ email })
  }

  await ScientistInvitation.create({ email, seedId: seed?.id, editionId })
  // send signup invitation email
}
