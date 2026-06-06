import { validateStaff } from '../middlewares/authMiddleware.js'
import * as service from '../services/usersService.js'
import { withController } from './controllerHandlers.js'

export const getHealth = withController(async (req, res) => {
  return res.status(200).send({ status: 'ok' })
})

export const getUsers = withController(async (req, res) => {
  await validateStaff(req)
  const users = await service.getUsers()
  return res.status(200).send(users)
})

export function createUser (req, res) {
  service.createUser(req, res)
}

export function getUserInfo (req, res) {
  service.getUserInfo(req, res)
}

export function editUser (req, res) {
  service.editUser(req, res)
}

export const getCurrentUser = withController(async (req, res) => {
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
