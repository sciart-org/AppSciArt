import * as service from '../services/userHackathonsService.js'
import { withErrorHandler } from './errorHandling.js'
import * as UsersService from '../services/usersService.js'
import { validateHackathonIsOpen } from '../validators/hackathonValidators.js'

export function getUserEnrolledHackathons (req, res) {
  service.getUserEnrolledHackathons(req, res)
}

export const joinHackathon = withErrorHandler(async (req, res) => {
  const { roles, interests } = req.body
  const { hackathonId, userId } = req.params
  const currentUser = await UsersService.getCurrentUserProfile(req)
  await validateHackathonIsOpen(currentUser?.id, hackathonId)

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

export const getMyHackathonParticipation = withErrorHandler(async (req, res) => {
  const user = await UsersService.getCurrentUserProfile(req)
  const { hackathonId } = req.params
  const participation = await service.getParticipation(user.id, hackathonId)
  return res.status(200).send(participation)
})

export const updateParticipation = withErrorHandler(async (req, res) => {
  return res.status(500)
})
