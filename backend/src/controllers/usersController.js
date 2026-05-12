import * as service from '../services/usersService.js'
import { withErrorHandler } from './errorHandling.js'

export const getHealth = withErrorHandler(async (req, res) => {
  return res.status(200).send({ status: 'ok' })
})

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
  const userData = await service.getCurrentUser(req)
  const userProfile = await service.getCurrentUserProfile(req)
  const roles = await service.getUserRoles(userProfile.id)
  return res.status(200).send({
    id: userProfile.id,
    jwt: userData.jwt,
    name: userData.user.user_metadata.name,
    surname: userData.user.user_metadata.surname,
    roles
  })
})
