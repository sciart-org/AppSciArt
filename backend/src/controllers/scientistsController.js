import { withErrorHandler } from './errorHandling.js'
import * as UsersService from '../services/usersService.js'
import * as service from '../services/scientistsService.js'
import { errorThrower } from '../services/errorThrower.js'

export const getMyScientistEditions = withErrorHandler(async (req, res) => {
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const editions = await service.getScientistOpenEditions(currentUser?.id)
  return res.status(200).send(editions)
})

export const getMyEditionSeeds = withErrorHandler(async (req, res) => {
  const editionId = req.params.editionId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const seeds = await service.getScientistSeedsOfEdition(currentUser?.id, editionId)
  return res.status(200).send(seeds)
})

export const getScientists = withErrorHandler(async (req, res) => {
  const currentUser = await UsersService.getCurrentUserProfile(req)
  errorThrower(!currentUser, 'Authentication required', 401)

  const editionId = req.query.editionId

  const scientists = await service.getScientists(currentUser?.id, editionId)
  return res.status(200).send(scientists)
})
