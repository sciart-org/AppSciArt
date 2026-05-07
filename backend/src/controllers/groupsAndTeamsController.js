import * as service from '../services/groupsAndTeamsService.js'
import { withErrorHandler } from './errorHandling.js'
import * as UsersService from '../services/usersService.js'
import { getMembers } from '../services/userHackathonsService.js'
import * as UserHackathonsService from '../services/userHackathonsService.js'
import { broadcastGroupUpdate, broadcastParticipationUpdate, broadcastTeamUpdate } from '../sockets/hackathonPhases.js'
import { errorThrower } from '../services/errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'

export const getHackathonExploringGroups = withErrorHandler(async (req, res) => {
  const { hackathonId } = req.params
  const exploringGroups = await service.getHackathonExploringGroups(hackathonId)
  return res.status(200).send(exploringGroups)
})

export const createExploringGroup = withErrorHandler(async (req, res) => {
  const { hackathonId } = req.params
  const { participantIds, seedId } = req.body
  const { broadcast } = req.query

  const currentUser = await UsersService.getCurrentUserProfile(req)
  errorThrower(!checkExists(currentUser), 'Authentication required', 401)

  const createdExploringGroup = await service.createExploringGroup(currentUser?.id, hackathonId, seedId)

  await Promise.all(participantIds.map(async participationId => {
    const updatedParticipation = await UserHackathonsService.updateParticipationById(currentUser?.id, participationId, { groupId: createdExploringGroup.id })
    broadcastParticipationUpdate(broadcast, hackathonId, participationId, updatedParticipation)
  }))

  const updatedParticipation = await UserHackathonsService.updateParticipationById(currentUser?.id, participantIds[0], { isGroupVoice: true })
  broadcastParticipationUpdate(broadcast, hackathonId, participantIds[0], updatedParticipation)

  broadcastGroupUpdate(broadcast === 'NONE' ? 'NONE' : 'STAFF', hackathonId, createdExploringGroup.id, createdExploringGroup)
  return res.status(201).send(await service.getExploringGroupDetails(createdExploringGroup.id))
})

export const getExploringGroupDetails = withErrorHandler(async (req, res) => {
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

export function getClusterCoCreationTeams (req, res) {
  service.getClusterCoCreationTeams(req, res)
}

export const createCoCreationTeam = withErrorHandler(async (req, res) => {
  const { hackathonId } = req.params
  const { participantIds, seedId } = req.body
  const { broadcast } = req.query

  const currentUser = await UsersService.getCurrentUserProfile(req)
  errorThrower(!checkExists(currentUser), 'Authentication required', 401)

  const createdCoCreationTeam = await service.createCoCreationTeam(currentUser?.id, hackathonId, seedId)

  await Promise.all(participantIds.map(async participationId => {
    const updatedParticipation = await UserHackathonsService.updateParticipationById(currentUser?.id, participationId, { teamId: createdCoCreationTeam.id })
    broadcastParticipationUpdate(broadcast, hackathonId, participationId, updatedParticipation)
  }))

  const updatedParticipation = await UserHackathonsService.updateParticipationById(currentUser?.id, participantIds[0], { isTeamSpeaker: true })
  broadcastParticipationUpdate(broadcast, hackathonId, participantIds[0], updatedParticipation)

  broadcastTeamUpdate(broadcast === 'NONE' ? 'NONE' : 'STAFF', hackathonId, createdCoCreationTeam.id, createdCoCreationTeam)
  return res.status(201).send(await service.getCoCreationTeamDetails(createdCoCreationTeam.id))
})

export function getCoCreationTeamDetails (req, res) {
  service.getCoCreationTeamDetails(req, res)
}

export function deleteCoCreationTeam (req, res) {
  service.deleteCoCreationTeam(req, res)
}

export function updateCoCreationTeam (req, res) {
  service.updateCoCreationTeam(req, res)
}

export const getConceptualMap = withErrorHandler(async (req, res) => {
  const groupId = req.params.groupId
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const conceptualMap = await service.getConceptualMap(currentUser?.id, groupId)
  return res.status(200).send(conceptualMap)
})

export const submitConceptualMap = withErrorHandler(async (req, res) => {
  const groupId = req.params.groupId
  const mapToSubmit = req.body
  const broadcast = req.query.broadcast
  const currentUser = await UsersService.getCurrentUserProfile(req)
  errorThrower(!checkExists(currentUser), 'Authentication required', 401)

  const updatedParticipationId = await service.submitConceptualMap(currentUser?.id, groupId, mapToSubmit)
  const updatedParticipation = await UserHackathonsService.getParticipationById(currentUser?.id, updatedParticipationId)
  broadcastGroupUpdate(broadcast, updatedParticipation.hackathonId, groupId, { isDelivered: updatedParticipation.conceptualMap.isDelivered })
  return res.status(200).send({
    ...updatedParticipation,
    ...(await getMembers(updatedParticipation))
  })
})

export const reopenConceptualMap = withErrorHandler(async (req, res) => {
  const groupId = req.params.groupId
  const broadcast = req.query.broadcast
  const currentUser = await UsersService.getCurrentUserProfile(req)
  errorThrower(!checkExists(currentUser), 'Authentication required', 401)

  const { map: updatedConceptualMap, hackathonId } = await service.reopenConceptualMap(currentUser?.id, groupId)
  broadcastGroupUpdate(broadcast, hackathonId, groupId, { isDelivered: updatedConceptualMap.isDelivered })
  return res.status(200).send(updatedConceptualMap)
})
