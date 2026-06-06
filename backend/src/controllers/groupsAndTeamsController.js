import * as service from '../services/groupsAndTeamsService.js'
import { withController } from './controllerHandlers.js'
import * as UsersService from '../services/usersService.js'
import * as UserHackathonsService from '../services/userHackathonsService.js'
import { broadcastGroupUpdate, broadcastParticipationUpdate, broadcastTeamUpdate } from '../sockets/hackathonPhases.js'
import { validateAuthenticated, validateStaff } from '../middlewares/authMiddleware.js'

export const getHackathonExploringGroups = withController(async (req, res) => {
  const { hackathonId } = req.params
  const exploringGroups = await service.getHackathonExploringGroups(hackathonId)
  return res.status(200).send(exploringGroups)
})

export const getHackathonCoCreationTeams = withController(async (req, res) => {
  const { hackathonId } = req.params
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const coCreationTeams = await service.getHackathonCoCreationTeams(currentUser?.id, hackathonId)
  return res.status(200).send(coCreationTeams)
})

export const createExploringGroup = withController(async (req, res) => {
  const { hackathonId } = req.params
  const { participantIds, seedId } = req.body
  const { broadcast } = req.query

  const currentUser = await validateStaff(req)

  const createdExploringGroup = await service.createExploringGroup(hackathonId, seedId)

  await Promise.all(participantIds.map(async participationId => {
    const updatedParticipation = await UserHackathonsService.updateParticipationById(currentUser?.id, participationId, { groupId: createdExploringGroup.id })
    broadcastParticipationUpdate(broadcast, hackathonId, participationId, updatedParticipation)
  }))

  const updatedParticipation = await UserHackathonsService.updateParticipationById(currentUser?.id, participantIds[0], { isGroupVoice: true })
  broadcastParticipationUpdate(broadcast, hackathonId, participantIds[0], updatedParticipation)

  broadcastGroupUpdate(broadcast === 'NONE' ? 'NONE' : 'STAFF', hackathonId, createdExploringGroup.id, createdExploringGroup)
  return res.status(201).send(await service.getExploringGroupDetails(createdExploringGroup.id))
})

export const getExploringGroupDetails = withController(async (req, res) => {
  const { groupId } = req.params
  const exploringGroup = await service.getExploringGroupDetails(groupId)
  return res.status(200).send(exploringGroup)
})

export function deleteExploringGroup (req, res) {
  service.deleteExploringGroup(req, res)
}

export function updateExploringGroup (req, res) {
  service.updateExploringGroup(req, res)
}

export const createCoCreationTeam = withController(async (req, res) => {
  const { hackathonId } = req.params
  const { participantIds, seedId } = req.body
  const { broadcast } = req.query

  const currentUser = await validateStaff(req)

  const createdCoCreationTeam = await service.createCoCreationTeam(hackathonId, seedId)

  await Promise.all(participantIds.map(async participationId => {
    const updatedParticipation = await UserHackathonsService.updateParticipationById(currentUser?.id, participationId, { teamId: createdCoCreationTeam.id })
    broadcastParticipationUpdate(broadcast, hackathonId, participationId, updatedParticipation)
  }))

  const updatedParticipation = await UserHackathonsService.updateParticipationById(currentUser?.id, participantIds[0], { isTeamSpeaker: true })
  broadcastParticipationUpdate(broadcast, hackathonId, participantIds[0], updatedParticipation)

  broadcastTeamUpdate(broadcast === 'NONE' ? 'NONE' : 'STAFF', hackathonId, createdCoCreationTeam.id, createdCoCreationTeam)
  return res.status(201).send(await service.getCoCreationTeamDetails(createdCoCreationTeam.id))
})

export const getCoCreationTeamDetails = withController(async (req, res) => {
  const { teamId } = req.params
  const coCreationTeam = await service.getCoCreationTeamDetails(teamId)
  return res.status(200).send(coCreationTeam)
})

export function deleteCoCreationTeam (req, res) {
  service.deleteCoCreationTeam(req, res)
}

export function updateCoCreationTeam (req, res) {
  service.updateCoCreationTeam(req, res)
}

export const getConceptualMap = withController(async (req, res) => {
  const groupId = req.params.groupId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const conceptualMap = await service.getConceptualMap(currentUser?.id, groupId)
  return res.status(200).send(conceptualMap)
})

export const submitConceptualMap = withController(async (req, res, addAfterCommit) => {
  const groupId = req.params.groupId
  const mapToSubmit = req.body
  const broadcast = req.query.broadcast
  const currentUser = await validateAuthenticated(req)

  const updatedParticipationId = await service.submitConceptualMap(currentUser?.id, groupId, mapToSubmit)
  const updatedParticipation = await UserHackathonsService.getParticipationById(currentUser?.id, updatedParticipationId)

  addAfterCommit(() =>
    broadcastGroupUpdate(broadcast, updatedParticipation.hackathonId, groupId, { isDelivered: updatedParticipation.conceptualMap.isDelivered })
  )

  return res.status(200).send(updatedParticipation)
})

export const reopenConceptualMap = withController(async (req, res) => {
  await validateStaff(req)

  const groupId = req.params.groupId
  const broadcast = req.query.broadcast

  const { map: updatedConceptualMap, hackathonId } = await service.reopenConceptualMap(groupId)
  broadcastGroupUpdate(broadcast, hackathonId, groupId, { isDelivered: updatedConceptualMap.isDelivered })
  return res.status(200).send(updatedConceptualMap)
})

export const submitFlower = withController(async (req, res) => {
  const teamId = req.params.teamId
  const broadcast = req.query.broadcast
  const currentUser = await validateAuthenticated(req)

  const updatedParticipationId = await service.submitFlower(currentUser?.id, teamId)
  const updatedParticipation = await UserHackathonsService.getParticipationById(currentUser?.id, updatedParticipationId)

  const flowerState = updatedParticipation?.teamFlower?.state
  const isDelivered = flowerState === 'IN_REVIEW' || flowerState === 'PUBLISHED'

  broadcastTeamUpdate(broadcast, updatedParticipation.hackathonId, teamId, { isDelivered })
  return res.status(200).send(updatedParticipation)
})

export const reopenFlower = withController(async (req, res) => {
  await validateStaff(req)

  const teamId = req.params.teamId
  const broadcast = req.query.broadcast

  const { flower: updatedFlower, hackathonId } = await service.reopenFlower(teamId)
  const isDelivered = updatedFlower?.state === 'IN_REVIEW' || updatedFlower?.state === 'PUBLISHED'

  broadcastTeamUpdate(broadcast, hackathonId, teamId, { isDelivered })
  return res.status(200).send(updatedFlower)
})
