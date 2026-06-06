import { jwtDecode } from 'jwt-decode'
import { getUserFromJwt } from '../auth/signin.js'
import { errorThrower } from './errorThrower.js'
import { getJwt } from './authService.js'
import { checkHasRole } from '../validators/userValidators.js'
import * as UsersRepository from '../repositories/usersRepository.js'
import { checkExists } from '../validators/generalValidators.js'
import * as HackathonsRepository from '../repositories/hackathonsRepository.js'
import { INTERNAL_ROLES, ROLES } from './Roles.js'
import * as ScientistsRepository from '../repositories/scientistsRepository.js'

export async function getUsers () {
  const userProfiles = await UsersRepository.getAuthenticatedUserProfiles()
  return userProfiles
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
  const [isAdministrator, isDesigner, isFacilitator, scientistEditions, evaluatorHackathons] = await Promise.all([
    checkHasRole(userId, INTERNAL_ROLES.ADMIN),
    checkHasRole(userId, INTERNAL_ROLES.DESIGNER),
    checkHasRole(userId, INTERNAL_ROLES.FACILITATOR),
    ScientistsRepository.getEditionsOfScientist(userId),
    HackathonsRepository.getEvaluatorRolesOfUser(userId)
  ])

  const roles = []
  if (isAdministrator || isDesigner || isFacilitator) {
    roles.push(ROLES.STAFF.name)
    if (isAdministrator) roles.push(INTERNAL_ROLES.ADMIN.name)
    if (isDesigner) roles.push(INTERNAL_ROLES.DESIGNER.name)
    if (isFacilitator) roles.push(INTERNAL_ROLES.FACILITATOR.name)
  }
  if (checkExists(scientistEditions)) roles.push(ROLES.SCIENTIST.name)
  if (checkExists(evaluatorHackathons)) roles.push(ROLES.EVALUATOR.name)

  return roles
}
