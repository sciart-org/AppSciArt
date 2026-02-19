import { Op } from 'sequelize'
import { Hackathon } from '../models/Hackathon.js'
import { validateHackathonIsReadable, validateHackathonNameUnique } from '../validators/hackathonValidators.js'
import { combineIncludes, includeEditionName, includeIsEnrolled, includeMyHackathons } from './includes/hackathonIncludes.js'
import { errorThrower } from './errorThrower.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { validateIsActive } from '../validators/editionValidators.js'
import { createDriveHackathon } from './driveService.js'

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

export async function getHackathons (userId) {
  const showPlannedHackathons = await checkIsStaff(userId)

  const whereClause = {}

  if (!showPlannedHackathons) {
    whereClause.state = { [Op.ne]: 'PLANNED' }
  }

  return await Hackathon.findAll({
    where: whereClause,
    ...combineIncludes([includeEditionName(), includeIsEnrolled(userId)])
  })
}

export async function createHackathon (userId, body) {
  errorThrower(!(await checkIsStaff(userId)), 'Unauthorized: You cannot create a hackathon', 403)
  const { logo, startDate, endDate, type, location, description, editionId, internalName, isPrivate } = body
  const edition = await validateIsActive(editionId)
  await validateHackathonNameUnique(internalName)
  const driveLink = await createDriveHackathon(edition?.driveLink, internalName, logo)
  const createdHackathon = await Hackathon.create({
    startDate, endDate, type, location, description, editionId, internalName, isPrivate, driveLink
  })
  return createdHackathon
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
