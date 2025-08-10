import * as service from '../services/hackathonsService.js'
import { withErrorHandler } from './errorHandling.js'
import * as UsersService from '../services/usersService.js'

export const getHackathons = withErrorHandler(async (req, res) => {
  const { filter } = req.query
  const currentUser = await UsersService.getCurrentUserProfile(req)

  if (filter === 'closest') {
    const hackathon = await service.getClosestHackathon(currentUser?.id)
    return res.status(200).send(hackathon)
  }

  if (filter === 'incoming') {
    const hackathons = await service.getIncomingHackathons(currentUser?.id)
    return res.status(200).send(hackathons)
  }

  if (filter === 'active') {
    const hackathon = await service.getActiveHackathon(currentUser?.id)
    return res.status(200).send(hackathon)
  }

  return res.status(400).json({
    message: 'Invalid filter or filtering not yet implemented'
  })
})

export function createHackathon (req, res) {
  service.createHackathon(req, res)
}

export const getHackathonDetails = withErrorHandler(async (req, res) => {
  const hackathonId = req.params.hackathonId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const hackathon = await service.getHackathonDetails(hackathonId, currentUser?.id)
  return res.status(200).send(hackathon)
})

export function updateHackathon (req, res) {
  service.updateHackathon(req, res)
}

export function deleteHackathon (req, res) {
  service.deleteHackathon(req, res)
}

export function publishHackathon (req, res) {
  service.publishHackathon(req, res)
}

export function getHackathonUsers (req, res) {
  service.getHackathonUsers(req, res)
}
