import * as service from '../services/userPreferencesService.js'

export function getLikedSeedsOfUser (req, res) {
  service.getLikedSeedsOfUser(req, res)
}

export function likeSeed (req, res) {
  service.likeSeed(req, res)
}

export function unlikeSeed (req, res) {
  service.unlikeSeed(req, res)
}
