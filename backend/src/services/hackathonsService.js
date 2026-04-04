import { Op } from 'sequelize'
import { Hackathon } from '../models/Hackathon.js'
import { validateCanEditHackathon, validateHackathonIsReadable, validateHackathonNameUnique } from '../validators/hackathonValidators.js'
import { combineIncludes, includeEditionName, includeIsEnrolled, includeMyHackathons } from './includes/hackathonIncludes.js'
import { errorThrower } from './errorThrower.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { validateIsActive } from '../validators/editionValidators.js'
import { createDriveHackathon, getEntitiesWithLogo, moveDriveFolder, parseFolderName, updateFolderName, uploadImg } from './driveService.js'
import { toPlainObject } from './mappers/utils.js'

export async function getClosestHackathon (userId) {
  const hackathon = await Hackathon.findOne({
    where: {
      state: { [Op.ne]: 'PLANNED' },
      startDate: {
        [Op.gte]: new Date()
      }
    },
    order: [['startDate', 'ASC']],
    ...combineIncludes([includeEditionName(), includeIsEnrolled(userId)])
  })

  const hackathonsWithLogo = await getEntitiesWithLogo([hackathon])
  return hackathonsWithLogo[0]
}

export async function getIncomingHackathons (userId) {
  const hackathons = await Hackathon.findAll({
    where: {
      state: { [Op.ne]: 'PLANNED' },
      startDate: {
        [Op.gte]: new Date()
      }
    },
    ...combineIncludes([includeEditionName(), includeIsEnrolled(userId)])
  })

  const hackathonsWithLogo = await getEntitiesWithLogo(hackathons)
  return hackathonsWithLogo
}

export async function getActiveHackathon (userId) {
  if (!userId) {
    return null
  }

  const now = new Date()

  const hackathon = await Hackathon.findOne({
    subQuery: false,
    ...combineIncludes([includeEditionName(), includeMyHackathons(userId)]),
    where: {
      startDate: { [Op.lte]: now },
      endDate: { [Op.gte]: now }
    }
  })

  const hackathonsWithLogo = await getEntitiesWithLogo([hackathon])
  return hackathonsWithLogo[0]
}

export async function getHackathons (userId) {
  const showAdminHackathons = await checkIsStaff(userId)

  const whereClause = {}

  if (!showAdminHackathons) {
    whereClause.state = { [Op.ne]: 'PLANNED' }
    whereClause.where = { isPrivate: false }
  }

  const hackathons = await Hackathon.findAll({
    where: whereClause,
    ...combineIncludes([includeEditionName(), includeIsEnrolled(userId)])
  })

  const hackathonsWithLogo = await getEntitiesWithLogo(hackathons)
  return hackathonsWithLogo
}

export async function createHackathon (userId, body) {
  errorThrower(!(await checkIsStaff(userId)), 'Unauthorized: You cannot create a hackathon', 403)
  const { logo, startDate, endDate, type, location, description, editionId, internalName, isPrivate, meetLink } = body
  const edition = await validateIsActive(editionId)
  await validateHackathonNameUnique(internalName)
  if (type !== 'ON_SITE') {
    errorThrower(!meetLink, 'A meet link is needed for online or hybrid hackathons', 400)
  }
  const driveLink = await createDriveHackathon(edition?.driveLink, internalName, logo)
  const createdHackathon = await Hackathon.create({
    startDate, endDate, type, location, description, editionId, internalName, isPrivate, driveLink, meetLink
  })
  const hackathonsWithLogo = await getEntitiesWithLogo([createdHackathon])
  return hackathonsWithLogo[0]
}

export async function getHackathonDetails (hackathonId, userId) {
  const hackathon = await validateHackathonIsReadable(userId, hackathonId)

  const descriptions = await hackathon.getDescriptions()
  const descriptionsPlain = descriptions.map(d => toPlainObject(d))

  const hackathonWithDescriptions = {
    ...toPlainObject(hackathon),
    descriptions: descriptionsPlain
  }

  const hackathonsWithLogo = await getEntitiesWithLogo([hackathonWithDescriptions])
  return hackathonsWithLogo[0]
}
export async function updateHackathon (currentUserId, hackathonId, body) {
  const hackathon = await validateCanEditHackathon(currentUserId, hackathonId)

  const { logo, startDate, endDate, type, location, description, editionId, internalName, isPrivate, meetLink } = body
  let edition

  if (type !== 'ON_SITE') {
    errorThrower(!meetLink && !hackathon.meetLink, 'A meet link is needed for online or hybrid hackathons', 400)
  }

  if (editionId) {
    edition = await validateIsActive(editionId)
    await moveDriveFolder(hackathon.driveLink, edition.driveLink)
  }

  if (internalName) {
    await validateHackathonNameUnique(internalName, hackathonId)
    const newFolderName = parseFolderName(internalName)
    await updateFolderName(hackathon.driveLink, newFolderName)
  }

  if (logo) {
    await uploadImg(logo, hackathon.driveLink)
  }

  const hackathonBody = { startDate, endDate, type, location, description, editionId, internalName, isPrivate, meetLink }

  if (Object.values(hackathonBody).some(v => v !== undefined)) {
    await hackathon.update(hackathonBody)
  }

  const hackathonsWithLogo = await getEntitiesWithLogo([hackathon])
  const result = hackathonsWithLogo[0]
  if (editionId) result.editionName = edition.name
  return result
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
