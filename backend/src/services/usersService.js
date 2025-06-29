import { jwtDecode } from 'jwt-decode'
import { getUserFromJwt } from '../auth/signin.js'
import { UserProfile } from '../models/UserProfile.js'
import { errorThrower } from './errorThrower.js'
import { getJwt } from './authService.js'

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
