import { Op } from 'sequelize'
import { Hackathon } from '../models/Hackathon.js'
import { validateHackathonById } from '../validators/hackathonValidators.js'
import { combineIncludes, includeEditionName, includeIsEnrolled } from './includes/hackathonIncludes.js'

export async function getClosestHackathon (userId) {
  return await Hackathon.findOne({
    where: {
      isVisible: true,
      startDate: {
        [Op.gte]: new Date()
      }
    },
    order: [['startDate', 'ASC']],
    ...combineIncludes([includeEditionName(), includeIsEnrolled(userId)])
  })
}

export async function getIncomingHackathons (userId) {
  return await Hackathon.findAll({
    where: {
      isVisible: true,
      startDate: {
        [Op.gte]: new Date()
      }
    },
    ...combineIncludes([includeEditionName(), includeIsEnrolled(userId)])
  })
}

export function createHackathon (req, res) {
  res.send({
    message: 'This is the mockup controller for createHackathon'
  })
}

export async function getHackathonDetails (hackathonId, userId) {
  await validateHackathonById(userId, hackathonId)
  const hackathon = await Hackathon.findByPk(
    hackathonId,
    combineIncludes([includeEditionName(), includeIsEnrolled(userId)])
  )
  return hackathon
}

export function updateHackathon (req, res) {
  res.send({
    message: 'This is the mockup controller for updateHackathon'
  })
}

export function deleteHackathon (req, res) {
  res.send({
    message: 'This is the mockup controller for deleteHackathon'
  })
}

export function publishHackathon (req, res) {
  res.send({
    message: 'This is the mockup controller for publishHackathon'
  })
}

export function getHackathonUsers (req, res) {
  res.send({
    message: 'This is the mockup controller for getHackathonUsers'
  })
}
