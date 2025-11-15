import { UserProfile } from '../models/UserProfile.js'

export async function getMinimalUser (userId) {
  return await UserProfile.findByPk(userId, {
    attributes: ['id']
  })
}
