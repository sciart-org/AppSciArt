import * as service from '../services/hackathonsService.js'

export function getHackathons (req, res) {
  service.getHackathons(req, res)
}

export function createHackathon (req, res) {
  service.createHackathon(req, res)
}

export function getHackathonDetails (req, res) {
  service.getHackathonDetails(req, res)
}

export function updateHackathon (req, res) {
  service.updateHackathon(req, res)
}

export function deleteHackathon (req, res) {
  service.deleteHackathon(req, res)
}

export function publishHackathon (req, res) {
  service.publishHackathon(req, res)
}

export function getHackathonUsers (req, res) {
  service.getHackathonUsers(req, res)
}
