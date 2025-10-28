import * as service from '../services/usersService.js'
import { withErrorHandler } from './errorHandling.js'

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

export const getCurrentUser = withErrorHandler(async (req, res) => {
  const result = await service.getCurrentUser(req)
  const roles = await service.getUserRoles(result?.id)
  return res.status(200).send({
    jwt: result.jwt,
    name: result.user.user_metadata.name,
    surname: result.user.user_metadata.surname,
    roles
  })
})
