import * as service from '../services/userHackathonsService.js'
import { withErrorHandler } from './errorHandling.js'
import * as UsersService from '../services/usersService.js'
import { validateHackathonById } from '../validators/hackathonValidators.js'

export function getUserEnrolledHackathons (req, res) {
  service.getUserEnrolledHackathons(req, res)
}

export const joinHackathon = withErrorHandler(async (req, res) => {
  const { roles, interests } = req.body
  const { hackathonId, userId } = req.params
  const currentUser = await UsersService.getCurrentUserProfile(req)
  await validateHackathonById(currentUser?.id, hackathonId)

  const participation = await service.joinHackathon(userId, hackathonId, roles, interests)
  return res.status(201).send(participation)
})

export const joinMeHackathon = withErrorHandler(async (req, res) => {
  const user = await UsersService.getCurrentUserProfile(req)
  req.params = { ...req.params, userId: user.id }
  return await joinHackathon(req, res)
})

export function getUserHackathonContributions (req, res) {
  service.getUserHackathonContributions(req, res)
}

export function joinCluster (req, res) {
  service.joinCluster(req, res)
}
