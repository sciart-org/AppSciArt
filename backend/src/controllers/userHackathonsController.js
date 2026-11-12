import * as service from '../services/userHackathonsService.js'
import { withController } from './controllerHandlers.js'
import { validateHackathonIsOpen } from '../validators/hackathonValidators.js'
import { broadcastParticipationUpdate, emitGroupsChangedToStaff, emitTeamsChangedToStaff } from '../sockets/hackathonPhases.js'
import { validateAuthenticated, validateStaff } from '../middlewares/authMiddleware.js'

export function getUserEnrolledHackathons (req, res) {
  service.getUserEnrolledHackathons(req, res)
}

const enrolInOpenHackathon = async (req, currentUser, userId) => {
  const { roles, interests } = req.body
  const { hackathonId } = req.params
  await validateHackathonIsOpen(currentUser.id, hackathonId)
  return await service.joinHackathon(userId, hackathonId, roles, interests)
}

export const joinHackathon = withController(async (req, res) => {
  const currentUser = await validateAuthenticated(req)
  const { userId } = req.params
  const isEnrollingSomeoneElse = userId !== currentUser.id
  if (isEnrollingSomeoneElse) await validateStaff(req)

  const participation = await enrolInOpenHackathon(req, currentUser, userId)
  return res.status(201).send(participation)
})

export const joinMeHackathon = withController(async (req, res) => {
  const currentUser = await validateAuthenticated(req)
  const participation = await enrolInOpenHackathon(req, currentUser, currentUser.id)
  return res.status(201).send(participation)
})

export function getUserHackathonContributions (req, res) {
  service.getUserHackathonContributions(req, res)
}

export function joinCluster (req, res) {
  service.joinCluster(req, res)
}

export const getMyHackathonParticipation = withController(async (req, res) => {
  const currentUser = await validateAuthenticated(req)

  const { hackathonId } = req.params
  const participation = await service.getParticipation(currentUser.id, hackathonId)

  return res.status(200).send(participation)
})

export const getMyEvaluatorRole = withController(async (req, res) => {
  const currentUser = await validateAuthenticated(req)

  const { hackathonId } = req.params
  const withRubrics = req.query.withRubrics === 'true'
  const evaluator = await service.getEvaluatorDetails(currentUser, hackathonId, { withRubrics })

  return res.status(200).send(evaluator)
})

export const getHackathonEvaluators = withController(async (req, res) => {
  await validateAuthenticated(req)

  const { hackathonId } = req.params
  const evaluator = await service.getHackathonEvaluators(hackathonId)

  return res.status(200).send(evaluator)
})

export const updateParticipation = withController(async (req, res, addAfterCommit) => {
  const currentUser = await validateStaff(req)

  const { hackathonId, userId } = req.params
  const participation = req.body
  const { broadcast } = req.query

  const updatedParticipation = await service.updateParticipationByUserAndHackathon(currentUser.id, userId, hackathonId, participation)

  addAfterCommit(() => broadcastParticipationUpdate(broadcast, hackathonId, updatedParticipation.id, updatedParticipation))
  if (participation.groupId !== undefined) addAfterCommit(() => emitGroupsChangedToStaff(hackathonId))
  if (participation.teamId !== undefined) addAfterCommit(() => emitTeamsChangedToStaff(hackathonId))

  return res.status(200).send(updatedParticipation)
})
