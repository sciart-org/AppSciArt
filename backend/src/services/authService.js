import { signInEmail } from '../auth/signin.js'
import { signUpEmail, signUpGoogle } from '../auth/signup.js'
import { UserProfile } from '../models/UserProfile.js'
import { EarlySignup } from '../models/EarlySignup.js'

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

const errorThrower = (condition, message, status) => {
  if (condition) {
    const err = new Error(message)
    err.status = status
    throw err
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

export async function getQuickRegister (email) {
  const quickRegister = await EarlySignup.findOne({ where: { email } })
  return quickRegister
}

export async function completeRegistration (body) {
  const email = body.email
  const quickRegiser = await getQuickRegister(email)
  errorThrower(!quickRegiser, 'The email provided is not pre-registered.', 400)

  await EarlySignup.destroy({ where: { email } })

  if (!quickRegiser.isProvider) {
    return await directRegister(body)
  }

  return await completeProviderRegistration(body)
}

const completeProviderRegistration = async (body) => {
  const { email } = body
  const existingUser = await UserProfile.findOne({ where: { email } })
  await createUserProfile({ ...body, id: existingUser.id, password: null })

  return await googleRegister()
}

const createUserProfile = async (body) => {
  const createdUserProfile = await UserProfile.findByPk(body.id)
  if (createdUserProfile) {
    createdUserProfile.set(body)
    await createdUserProfile.save()
  }
  return createdUserProfile
}
