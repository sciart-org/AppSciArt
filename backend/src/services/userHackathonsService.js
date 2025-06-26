import { Hackathon } from '../models/Hackathon.js'
import { Participation } from '../models/Participation.js'
import { UserProfile } from '../models/UserProfile.js'
import { checkExists } from '../validators/generalValidators.js'
import { errorThrower } from './errorThrower.js'

export function getUserEnrolledHackathons (req, res) {
  res.send({
    message: 'This is the mockup controller for getUserEnrolledHackathons'
  })
}

export async function joinHackathon (userId, hackathonId, roles, interests) {
  const user = await UserProfile.findByPk(userId)
  errorThrower(!checkExists(user), 'User not found.', 404)
  const hackathon = await Hackathon.findByPk(hackathonId)
  errorThrower(!checkExists(hackathon), 'Hackathon not found.', 404)

  const enrollment = Participation.create({
    userProfileId: userId,
    hackathonId,
    roles,
    interests
  })
  return enrollment
}

export function getUserHackathonContributions (req, res) {
  res.send({
    message: 'This is the mockup controller for getUserHackathonContributions'
  })
}

export function joinCluster (req, res) {
  res.send({
    message: 'This is the mockup controller for joinCluster'
  })
}
