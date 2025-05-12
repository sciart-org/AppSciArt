import * as service from '../services/groupsAndTeamsService.js'

export function getClusterExploringGroups (req, res) {
  service.getClusterExploringGroups(req, res)
}

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
