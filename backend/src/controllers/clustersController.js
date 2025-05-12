import * as service from '../services/clustersService.js'

export function getHackathonClusters (req, res) {
  service.getHackathonClusters(req, res)
}

export function createCluster (req, res) {
  service.createCluster(req, res)
}

export function getClusterDetails (req, res) {
  service.getClusterDetails(req, res)
}

export function deleteCluster (req, res) {
  service.deleteCluster(req, res)
}
