import { Op } from 'sequelize'
import { Hackathon } from '../models/Hackathon.js'
import { validateHackathonIsReadable } from '../validators/hackathonValidators.js'
import { combineIncludes, includeEditionName, includeIsEnrolled, includeMyHackathons } from './includes/hackathonIncludes.js'

export async function getClosestHackathon (userId) {
  return await Hackathon.findOne({
    where: {
      state: { [Op.ne]: 'PLANNED' },
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
      state: { [Op.ne]: 'PLANNED' },
      startDate: {
        [Op.gte]: new Date()
      }
    },
    ...combineIncludes([includeEditionName(), includeIsEnrolled(userId)])
  })
}

export async function getActiveHackathon (userId) {
  if (!userId) {
    return null
  }

  const now = new Date()

  return await Hackathon.findOne({
    subQuery: false,
    ...combineIncludes([includeEditionName(), includeMyHackathons(userId)]),
    where: {
      startDate: { [Op.lte]: now },
      endDate: { [Op.gte]: now }
    }
  })
}

export function createHackathon (req, res) {
  res.send({
    message: 'This is the mockup controller for createHackathon'
  })
}

export async function getHackathonDetails (hackathonId, userId) {
  await validateHackathonIsReadable(userId, hackathonId)
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
