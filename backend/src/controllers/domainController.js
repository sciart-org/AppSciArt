import * as service from '../services/domainService.js'

export function getAreasOfInterest (req, res) {
  service.getAreasOfInterest(req, res)
}

export function getAffiliations (req, res) {
  service.getAffiliations(req, res)
}

export function getHackathonRoles (req, res) {
  service.getHackathonRoles(req, res)
}
