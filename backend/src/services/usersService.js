import { jwtDecode } from 'jwt-decode'
import { getUserFromJwt } from '../auth/signin.js'
import { errorThrower } from './errorThrower.js'
import { getJwt } from './authService.js'
import { Administrator } from '../models/roles/Administrator.js'
import { checkHasRoleById, checkIsInspiringScientist } from '../validators/userValidators.js'
import { Designer } from '../models/roles/Designer.js'
import { Evaluator } from '../models/roles/Evaluator.js'
import { Facilitator } from '../models/roles/Facilitator.js'
import * as UsersRepository from '../repositories/usersRepository.js'
import { checkExists } from '../validators/generalValidators.js'

export function getUsers (req, res) {
  res.send({
    message: 'This is the mockup controller for getUsers'
  })
}

export function createUser (req, res) {
  res.send({
    message: 'This is the mockup controller for createUser'
  })
}

export function getUserInfo (req, res) {
  res.send({
    message: 'This is the mockup controller for getUserInfo'
  })
}

export function editUser (req, res) {
  res.send({
    message: 'This is the mockup controller for editUser'
  })
}

export async function getUserProfileByEmail (email) {
  const userProfile = await UsersRepository.getUserProfileByEmail(email)
  errorThrower(!checkExists(userProfile), `User with email ${email} not found`, 404)
  return userProfile
}

export async function getCurrentUserProfileFromJwt (jwt) {
  const userEmail = jwtDecode(jwt).email
  const user = await getUserProfileByEmail(userEmail)
  return user
}

export async function getCurrentUserProfile (req) {
  const jwt = getJwt(req)
  if (!jwt) return null
  return await getCurrentUserProfileFromJwt(jwt)
}

export async function getCurrentUser (req) {
  const jwt = getJwt(req)
  const { data, error } = await getUserFromJwt(jwt)
  errorThrower(error?.status, error?.message, error?.status)
  return { ...data, jwt }
}

export async function getUserRoles (userId) {
  const [isAdministrator, isDesigner, isEvaluator, isFacilitator, isScientist] = await Promise.all([
    checkHasRoleById(userId, Administrator),
    checkHasRoleById(userId, Designer),
    checkHasRoleById(userId, Evaluator),
    checkHasRoleById(userId, Facilitator),
    checkIsInspiringScientist(userId)
  ])

  const roles = []
  if (isAdministrator) roles.push('administrator')
  if (isDesigner) roles.push('designer')
  if (isEvaluator) roles.push('evaluator')
  if (isFacilitator) roles.push('facilitator')
  if (isScientist) roles.push('inspiring_scientist')

  return roles
}
