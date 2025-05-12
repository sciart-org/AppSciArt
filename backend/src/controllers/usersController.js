import * as service from '../services/usersService.js'

export function getUsers (req, res) {
  service.getUsers(req, res)
}

export function createUser (req, res) {
  service.createUser(req, res)
}

export function getUserInfo (req, res) {
  service.getUserInfo(req, res)
}

export function editUser (req, res) {
  service.editUser(req, res)
}
