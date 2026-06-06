import * as service from '../services/hackathonsService.js'
import { withController } from './controllerHandlers.js'
import * as UsersService from '../services/usersService.js'
import { broadcastHackathonUpdate } from '../sockets/hackathonPhases.js'
import { validateAuthenticated, validateStaff } from '../middlewares/authMiddleware.js'

export const getHackathons = withController(async (req, res) => {
  const { filter } = req.query
  const currentUser = await UsersService.getCurrentUserProfile(req)

  let hackathons

  if (filter === 'closest') {
    hackathons = await service.getClosestHackathon(currentUser?.id)
  } else if (filter === 'incoming') {
    hackathons = await service.getIncomingHackathons(currentUser?.id)
  } else if (filter === 'active') {
    hackathons = await service.getActiveHackathon(currentUser?.id)
  } else if (!filter) {
    hackathons = await service.getHackathons(currentUser?.id)
  } else {
    return res.status(400).json({
      message: 'Invalid filter or filtering not yet implemented'
    })
  }

  return res.status(200).send(hackathons)
})

export const createHackathon = withController(async (req, res) => {
  const currentUser = await validateStaff(req)
  const createdHackathon = await service.createHackathon(currentUser?.id, req.body)
  return res.status(201).send(createdHackathon)
})

export const getHackathonDetails = withController(async (req, res) => {
  const hackathonId = req.params.hackathonId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const hackathon = await service.getHackathonDetails(hackathonId, currentUser?.id)
  return res.status(200).send(hackathon)
})

export const updateHackathon = withController(async (req, res, addAfterCommit) => {
  const currentUser = await validateAuthenticated(req)

  const hackathonId = req.params.hackathonId
  const hackathon = req.body
  const { broadcast } = req.query

  const updatedHackathon = await service.updateHackathon(currentUser?.id, hackathonId, hackathon)
  addAfterCommit(() => broadcastHackathonUpdate(broadcast, hackathonId, updatedHackathon))

  return res.status(200).send(updatedHackathon)
})

export function deleteHackathon (req, res) {
  service.deleteHackathon(req, res)
}

export function publishHackathon (req, res) {
  service.publishHackathon(req, res)
}

export function getHackathonUsers (req, res) {
  service.getHackathonUsers(req, res)
}

export const nextHackathonPhase = withController(async (req, res, addAfterCommit) => {
  const currentUser = await validateStaff(req)

  const hackathonId = req.params.hackathonId
  const { broadcast } = req.query

  const updatedHackathon = await service.nextHackathonPhase(currentUser?.id, hackathonId)
  addAfterCommit(() => broadcastHackathonUpdate(broadcast, hackathonId, updatedHackathon))

  return res.status(200).send(updatedHackathon)
})
