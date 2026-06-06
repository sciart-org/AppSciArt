import { withController } from './controllerHandlers.js'
import * as UsersService from '../services/usersService.js'
import * as service from '../services/scientistsService.js'
import { validateStaff } from '../middlewares/authMiddleware.js'

export const getMyScientistEditions = withController(async (req, res) => {
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const editions = await service.getScientistOpenEditions(currentUser?.id)
  return res.status(200).send(editions)
})

export const getMyEditionSeeds = withController(async (req, res) => {
  const editionId = req.params.editionId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const seeds = await service.getScientistSeedsOfEdition(currentUser?.id, editionId)
  return res.status(200).send(seeds)
})

export const getScientists = withController(async (req, res) => {
  await validateStaff(req)

  const editionId = req.query.editionId

  const scientists = await service.getScientists(editionId)
  return res.status(200).send(scientists)
})

export const modifyScientistEditions = withController(async (req, res) => {
  await validateStaff(req)

  const scientistId = req.params.scientistId
  const editions = req.body

  const enrollments = await service.modifyScientistEditions(scientistId, editions)
  return res.status(200).send(enrollments)
})
