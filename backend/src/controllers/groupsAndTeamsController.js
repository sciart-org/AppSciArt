import * as service from '../services/groupsAndTeamsService.js'
import { withErrorHandler } from './errorHandling.js'
import * as UsersService from '../services/usersService.js'

export const getClusterExploringGroups = withErrorHandler(async (req, res) => {
  const { hackathonId, clusterNumber } = req.params
  const exploringGroups = await service.getClusterExploringGroups(hackathonId, clusterNumber)
  return res.status(200).send(exploringGroups)
})

export function createExploringGroup (req, res) {
  service.createExploringGroup(req, res)
}

export function getExploringGroupDetails (req, res) {
  service.getExploringGroupDetails(req, res)
}

export function deleteExploringGroup (req, res) {
  service.deleteExploringGroup(req, res)
}

export function updateExploringGroup (req, res) {
  service.updateExploringGroup(req, res)
}

export function getClusterCoCreationTeams (req, res) {
  service.getClusterCoCreationTeams(req, res)
}

export function createCoCreationTeam (req, res) {
  service.createCoCreationTeam(req, res)
}

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
  const currentUser = await UsersService.getCurrentUserProfile(req)
  const updatedParticipation = await service.submitConceptualMap(currentUser?.id, groupId, mapToSubmit)
  return res.status(200).send(updatedParticipation)
})
