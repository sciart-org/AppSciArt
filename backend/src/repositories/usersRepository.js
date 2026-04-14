import { UserProfile } from '../models/UserProfile.js'

export async function getMinimalUserProfile (userId) {
  return UserProfile.findByPk(userId, {
    attributes: ['id']
  })
}

export async function getMinimalUserProfileByAuthId (authId) {
  if (!authId) return null

  return UserProfile.findOne({
    where: { authId },
    attributes: ['id']
  })
}

export async function getUserProfileByEmail (email) {
  if (!email) return null

  return UserProfile.findOne({
    where: {
      email
    }
  })
}

export async function getUserProfileById (userId) {
  return UserProfile.findByPk(userId)
}
