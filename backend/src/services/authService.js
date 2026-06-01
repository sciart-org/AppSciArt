import { signInEmail } from '../auth/signin.js'
import { signUpEmail, signUpGoogle } from '../auth/signup.js'
import { UserProfile } from '../models/UserProfile.js'
import { errorThrower } from './errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'
import { getUserRoles } from './usersService.js'
import { sendQuickRegisterEmail } from '../emails/emailService.js'
import * as UsersRepository from '../repositories/usersRepository.js'
import * as AuthRepository from '../repositories/authRepository.js'

export async function login ({ email, password }) {
  const { data, error } = await signInEmail(email, password)

  errorThrower(error?.status, error?.message, error?.status)

  const userProfile = await UsersRepository.getMinimalUserProfileByAuthId(data.user.id)
  const roles = await getUserRoles(userProfile.id)

  return {
    id: userProfile.id,
    jwt: data.session.access_token,
    name: data.user.user_metadata.name,
    surname: data.user.user_metadata.surname,
    roles
  }
}

export async function directRegister (body) {
  const { data, error } = await signUpEmail(body.email, body.password, { name: body.name, surname: body.surname })

  errorThrower(error?.status, error?.message, error?.status)

  const id = data.user.id
  const createdUserProfile = await createUserProfile({ authId: id, ...body })
  const roles = await getUserRoles(createdUserProfile.id)

  return {
    id: createdUserProfile.id,
    jwt: data.session.access_token,
    name: data.user.user_metadata.name,
    surname: data.user.user_metadata.surname,
    roles
  }
}

export async function googleRegister () {
  const { data, error } = await signUpGoogle()

  errorThrower(error?.status, error?.message, error?.status)

  return {
    url: data.url
  }
}

export async function quickRegister (email) {
  const existingUser = await UsersRepository.getUserProfileByEmail(email)
  const existingEarlySignup = await AuthRepository.getPreRegistration(email)

  const alreadyRegistered = existingUser !== null || existingEarlySignup !== null
  errorThrower(alreadyRegistered, 'Account with that email already registered.', 400)

  const preRegistration = await AuthRepository.preRegisterUser(email)
  sendQuickRegisterEmail(email, preRegistration?.id)
  return { message: 'Pre-registered successfully' }
}

export async function completeRegistration (body) {
  const email = body.email
  const quickRegiser = await getEarlySignupByEmail(email)
  errorThrower(!quickRegiser, 'The email provided is not pre-registered.', 400)

  if (!quickRegiser.isProvider) {
    errorThrower(body.password === null, 'You must provide a password.', 400)
    return await directRegister(body)
  }

  return await completeProviderRegistration(body)
}

export async function getEarlySignup (id) {
  const earlySignup = await AuthRepository.getPreRegistrationById(id)
  return earlySignup
}

export async function removeEarlySignupByEmail (email) {
  await AuthRepository.removePreRegistrationByEmail(email)
}

async function getEarlySignupByEmail (email) {
  const earlySignup = await AuthRepository.getPreRegistration(email)
  return earlySignup
}

async function completeProviderRegistration (body) {
  const { email } = body
  const existingUser = await UsersRepository.getUserProfileByEmail(email)
  await createUserProfile({ ...body, authId: existingUser.authId, password: null })

  return await googleRegister()
}

async function createUserProfile (body) {
  const data = {
    ...body,
    ...(checkExists(body.ageRange) && { rangeSetAt: Date.now() })
  }

  const existingAuth = await UsersRepository.getMinimalUserProfileByAuthId(body.authId)

  if (checkExists(existingAuth)) {
    return await existingAuth.set(data).save()
  }

  const existingEmail = await UsersRepository.getUserProfileByEmail(body.email)

  if (checkExists(existingEmail)) {
    return await existingEmail.set(data).save()
  }

  return await UserProfile.create(data)
}

export function getJwt (req) {
  const jwt = req?.headers?.authorization?.replace('Bearer ', '')
  if (!jwt || jwt === 'null') {
    return null
  }
  return req.headers.authorization.replace('Bearer ', '')
}
