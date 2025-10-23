import { Seed } from '../models/Seed.js'
import { UserProfile } from '../models/UserProfile.js'
import { errorThrower } from '../services/errorThrower.js'
import { checkIsInspiringScientist, checkIsStaff } from './userValidators.js'

const validateIsPublishedOrStaff = async (userId, product) => {
  return errorThrower(product.state !== 'PUBLISHED' && !(await checkIsStaff(userId)), 'Unauthorized: You cannot access this resource', 403)
}

const checkSeedIsFromScientist = async (seedId, userId) => {
  const count = await Seed.count({
    where: {
      id: seedId
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
  return (count > 0)
}

const validateCanGetSeed = async (userId, seed) => {
  if (seed.state !== 'PUBLISHED') {
    errorThrower(!userId, 'Authentication required', 401)
  }

  const errorMessage = 'You cannot access this seed'
  const isStaff = await checkIsStaff(userId)
  const isScientist = await checkIsInspiringScientist(userId)
  const isSeedOwner = await checkSeedIsFromScientist(seed?.id, userId)

  if (seed.state === 'IN_REVIEW') {
    errorThrower(!isStaff, errorMessage, 403)
  } else if (seed.state !== 'PUBLISHED') {
    errorThrower(!(isScientist || isStaff), errorMessage, 403)
    errorThrower(!isSeedOwner, errorMessage, 403)
  }

  if (!(isStaff || isSeedOwner)) {
    seed.template = undefined
  }
}

export { validateIsPublishedOrStaff, validateCanGetSeed }
