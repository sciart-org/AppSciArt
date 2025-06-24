import * as service from '../services/hackathonsService.js'
import { withErrorHandler } from './errorHandling.js'

export const getHackathons = withErrorHandler(async (req, res) => {
  const { filter } = req.query

  if (filter === 'closest') {
    return res.status(501).json({
      message: 'Fetch closest hackathon not yet implemented'
    })
  }

  if (filter === 'incoming') {
    const hackathons = await service.getIncomingHackathons()
    return res.status(200).send(hackathons)
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
  const result = await service.getHackathonDetails(hackathonId)
  res.status(200).send(result)
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
