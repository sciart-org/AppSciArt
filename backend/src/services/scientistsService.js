import { InspiringScientist } from '../models/roles/InspiringScientist.js'
import { checkHasRoleById } from '../validators/userValidators.js'
import { errorThrower } from '../services/errorThrower.js'
import { Edition } from '../models/Edition.js'
import { UserProfile } from '../models/UserProfile.js'
import { Seed } from '../models/Seed.js'

export async function getScientistOpenEditions (userId) {
  errorThrower(!(await checkHasRoleById(userId, InspiringScientist)), 'You are not an inspiring scientist', 403)
  return await Edition.findAll({
    include: [
      {
        model: InspiringScientist,
        attributes: [],
        required: true,
        include: [
          {
            model: UserProfile,
            where: { id: userId },
            attributes: [],
            required: true
          }
        ]
      }
    ]
  })
}

export async function getScientistSeedsOfEdition (userId, editionId) {
  errorThrower(!(await checkHasRoleById(userId, InspiringScientist)), 'You are not an inspiring scientist', 403)
  return await Seed.findAll({
    attributes: ['id', 'title', 'mainImage'],
    include: [
      {
        model: InspiringScientist,
        attributes: [],
        required: true,
        include: [
          {
            model: UserProfile,
            where: { id: userId },
            attributes: [],
            required: true
          }
        ]
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
