import { validateCanEditHackathon, validateHackathonIsReadable, validateHackathonNameUnique } from '../validators/hackathonValidators.js'
import { errorThrower } from './errorThrower.js'
import { checkIsStaff } from '../validators/userValidators.js'
import { validateIsActive } from '../validators/editionValidators.js'
import { createDriveHackathon, getEntitiesWithLogo, moveDriveFolder, parseFolderName, updateFolderName, uploadImg } from './driveService.js'
import { toPlainObject } from './mappers/utils.js'
import * as HackathonRepository from '../repositories/hackathonsRepository.js'
import { HackathonStates } from '../states/HackathonStates.js'

export async function getClosestHackathon (userId) {
  const hackathon = await HackathonRepository.getClosestHackathon(userId)

  const [hackathonWithLogo] = await getEntitiesWithLogo([hackathon])
  return hackathonWithLogo
}

export async function getIncomingHackathons (userId) {
  const hackathons = await HackathonRepository.getIncomingHackathons(userId)

  const hackathonsWithLogo = await getEntitiesWithLogo(hackathons)
  return hackathonsWithLogo
}

export async function getActiveHackathon (userId) {
  if (!userId) {
    return null
  }

  const hackathon = await HackathonRepository.getActiveHackathon(userId, await checkIsStaff(userId))

  const [hackathonWithLogo] = await getEntitiesWithLogo([hackathon])
  return hackathonWithLogo
}

export async function getHackathons (userId) {
  const isAdmin = await checkIsStaff(userId)

  const hackathons = await HackathonRepository.getHackathons(userId, isAdmin)

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
  const createdHackathon = await HackathonRepository.createHackathon({
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

  const isPreparing = hackathon.phase === 'PREPARING'
  const noMeetLink = !meetLink && !hackathon.meetLink
  const isOnSite = type !== 'ON_SITE'
  errorThrower(!isPreparing && !isOnSite && noMeetLink, 'A meet link is needed for online or hybrid hackathons', 400)

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

export async function nextHackathonPhase (currentUserId, hackathonId) {
  errorThrower(!(await checkIsStaff(currentUserId)), 'Unauthorized: You cannot alter the state of a hackathon', 403)
  const hackathon = await HackathonRepository.getHackathonById(currentUserId, hackathonId, true)

  await HackathonStates.advancePhase(hackathon)

  return hackathon
}
