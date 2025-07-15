import { signInEmail } from '../auth/signin.js'
import { signUpEmail, signUpGoogle } from '../auth/signup.js'
import { UserProfile } from '../models/UserProfile.js'
import { EarlySignup } from '../models/EarlySignup.js'
import { errorThrower } from './errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'

export async function login ({ email, password }) {
  const { data, error } = await signInEmail(email, password)

  errorThrower(error?.status, error?.message, error?.status)

  return {
    jwt: data.session.access_token,
    name: data.user.user_metadata.name,
    surname: data.user.user_metadata.surname
  }
}

export async function directRegister (body) {
  const { data, error } = await signUpEmail(body.email, body.password, { name: body.name, surname: body.surname })

  errorThrower(error?.status, error?.message, error?.status)

  const id = data.user.id
  await createUserProfile({ id, ...body })

  return {
    jwt: data.session.access_token,
    name: data.user.user_metadata.name,
    surname: data.user.user_metadata.surname
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
  const existingUser = await UserProfile.findOne({ where: { email } })
  const existingEarlySignup = await EarlySignup.findOne({ where: { email } })

  const alreadyRegistered = existingUser !== null || existingEarlySignup !== null
  errorThrower(alreadyRegistered, 'Account with that email already registered.', 400)

  await EarlySignup.create({ email })
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
  const earlySignup = await EarlySignup.findByPk(id)
  return earlySignup
}

export async function removeEarlySignupByEmail (email) {
  await EarlySignup.destroy({ where: { email } })
}

async function getEarlySignupByEmail (email) {
  const earlySignup = await EarlySignup.findOne({ where: { email } })
  return earlySignup
}

async function completeProviderRegistration (body) {
  const { email } = body
  const existingUser = await UserProfile.findOne({ where: { email } })
  await createUserProfile({ ...body, id: existingUser.id, password: null })

  return await googleRegister()
}

async function createUserProfile (body) {
  const createdUserProfile = await UserProfile.findByPk(body.id)
  if (checkExists(createdUserProfile)) {
    createdUserProfile.set(body)
    if (checkExists(createUserProfile.ageRange)) {
      createdUserProfile.rangeSetAt = Date.now()
    }
    await createdUserProfile.save()
  }
  return createdUserProfile
}

export function getJwt (req) {
  const jwt = req?.headers?.authorization?.replace('Bearer ', '')
  if (!jwt || jwt === 'null') {
    return null
  }
  return req.headers.authorization.replace('Bearer ', '')
}
