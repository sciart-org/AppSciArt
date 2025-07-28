import { jwtDecode } from 'jwt-decode'
import { getUserFromJwt } from '../auth/signin.js'
import { UserProfile } from '../models/UserProfile.js'
import { errorThrower } from './errorThrower.js'
import { getJwt } from './authService.js'
import { Administrator } from '../models/roles/Administrator.js'
import { checkHasRoleById } from '../validators/userValidators.js'
import { Designer } from '../models/roles/Designer.js'
import { Evaluator } from '../models/roles/Evaluator.js'
import { Facilitator } from '../models/roles/Facilitator.js'
import { InspiringScientist } from '../models/roles/InspiringScientist.js'

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

export async function getCurrentUserProfile (req) {
  const jwt = getJwt(req)
  if (!jwt) return null
  const userEmail = jwtDecode(jwt).email
  const user = await UserProfile.findOne({
    where: {
      email: userEmail
    }
  })
  errorThrower(!user, 'User not found', 404)
  return user
}

export async function getCurrentUser (req) {
  const jwt = getJwt(req)
  const { data, error } = await getUserFromJwt(jwt)
  errorThrower(error?.status, error?.message, error?.status)
  return { ...data, jwt }
}

export async function getUserRoles (userId) {
  const roles = []

  const isAdministrator = await checkHasRoleById(userId, Administrator)
  if (isAdministrator) {
    roles.push('administrator')
  }

  const isDesigner = await checkHasRoleById(userId, Designer)
  if (isDesigner) {
    roles.push('designer')
  }

  const isEvaluator = await checkHasRoleById(userId, Evaluator)
  if (isEvaluator) {
    roles.push('evaluator')
  }

  const isFacilitator = await checkHasRoleById(userId, Facilitator)
  if (isFacilitator) {
    roles.push('facilitator')
  }

  const isScientist = await checkHasRoleById(userId, InspiringScientist)
  if (isScientist) {
    roles.push('inspiring_scientist')
  }

  return roles
}
