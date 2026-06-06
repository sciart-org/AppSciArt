import * as service from '../services/editionsService.js'
import * as UsersService from '../services/usersService.js'
import * as ScientistsService from '../services/scientistsService.js'
import { withController } from './controllerHandlers.js'
import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'
import { createDriveEdition, deleteDriveFolder } from '../services/driveService.js'
import { validateEditionNameUnique } from '../validators/editionValidators.js'
import { validateStaff } from '../middlewares/authMiddleware.js'

export const getEditions = withController(async (req, res) => {
  const currentUser = await UsersService.getCurrentUserProfile(req)

  let { state } = req.query
  if (checkExists(state) && !Array.isArray(state)) {
    state = [state]
  }

  const editions = await service.getEditions(currentUser?.id, state)
  return res.status(200).send(editions)
})

export const createEdition = withController(async (req, res) => {
  await validateStaff(req)
  const { name, year, shortDescription, longDescription, logo } = req.body
  await validateEditionNameUnique(name)
  const { driveLink, folderId } = await createDriveEdition(year, name, logo)
  try {
    const createdEdition = await service.createEdition({ name, year, shortDescription, longDescription, driveLink })
    return res.status(201).send(createdEdition)
  } catch (error) {
    await deleteDriveFolder(folderId)
    throw error
  }
})

export const getEditionDetails = withController(async (req, res) => {
  const editionId = req.params.editionId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const edition = await service.getEditionDetails(currentUser?.id, editionId)
  return res.status(200).send(edition)
})

export const updateEdition = withController(async (req, res) => {
  const currentUser = await validateStaff(req)

  const editionId = req.params.editionId
  const edition = req.body

  const updatedEdition = await service.updateEdition(editionId, edition)
  const editionDetails = await service.getEditionDetails(currentUser.id, updatedEdition.id)
  return res.status(200).send(editionDetails)
})

export function deleteEdition (req, res) {
  service.deleteEdition(req, res)
}

export function publishEdition (req, res) {
  service.publishEdition(req, res)
}

export function getEditionMethodology (req, res) {
  service.getEditionMethodology(req, res)
}

export const inviteScientistToEdition = withController(async (req, res, addAfterCommit) => {
  await validateStaff(req)

  const editionId = req.params.editionId
  const { email, userProfileId } = req.body
  const { sendEmail } = req.query
  let destinationEmail = email
  let earlySignUpId

  errorThrower(!(checkExists(email) || checkExists(userProfileId)), 'Either a user or an email must be specified', 400)

  if (checkExists(userProfileId)) {
    destinationEmail = await ScientistsService.inviteScientistByUserProfileId(userProfileId, editionId)
  } else {
    earlySignUpId = await ScientistsService.inviteScientistByEmail(email, editionId, null)
  }

  addAfterCommit(() =>
    ScientistsService.sendScientistInvitationEmail(editionId, destinationEmail, sendEmail, earlySignUpId)
  )

  return res.status(200).send({ message: 'Scientist invited successfully' })
})

export const announceEdition = withController(async (req, res) => {
  await validateStaff(req)
  const editionId = req.params.editionId

  const announcedEdition = await service.announceEdition(editionId)
  return res.status(200).send(announcedEdition)
})
