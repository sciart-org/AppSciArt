import * as service from '../services/userHackathonsService.js'
import { withErrorHandler } from './errorHandling.js'
import * as UsersService from '../services/usersService.js'

export function getUserEnrolledHackathons (req, res) {
  service.getUserEnrolledHackathons(req, res)
}

export const joinHackathon = withErrorHandler(async (req, res) => {
  const { roles, interests } = req.body
  const { hackathonId, userId } = req.params
  const result = await service.joinHackathon(userId, hackathonId, roles, interests)
  return res.status(201).send(result)
})

export const joinMeHackathon = withErrorHandler(async (req, res) => {
  const { roles, interests } = req.body
  const { hackathonId } = req.params
  const user = await UsersService.getCurrentUserProfile(req)
  const result = await service.joinHackathon(user?.id, hackathonId, roles, interests)
  return res.status(201).send(result)
})

export function getUserHackathonContributions (req, res) {
  service.getUserHackathonContributions(req, res)
}

export function joinCluster (req, res) {
  service.joinCluster(req, res)
}
