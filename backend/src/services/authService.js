import { signInEmail } from '../auth/signin.js'
import { signUpEmail, signUpGoogle } from '../auth/signup.js'
import { UserProfile } from '../models/UserProfile.js'
import { EarlySignup } from '../models/EarlySignup.js'
import { authBodyValidator } from '../validators/authValidators.js'

export async function login (req, res) {
  const { email, password } = req.body
  const { data, error } = await signInEmail(email, password)
  if (error?.status) {
    res.status(error.status).send({ error: error.message })
  } else {
    res.status(201).send({
      jwt: data.session.access_token,
      name: data.user.user_metadata.name,
      surname: data.user.user_metadata.surname
    })
  }
}

export async function directRegister (req, res) {
  const { email, password, name, surname, gender, birthDate, affiliations, areasOfInterest } = req.body

  authBodyValidator(req, res)
  const { data, error } = await signUpEmail(email, password, { name, surname })

  if (error?.status) {
    res.status(error.status).send({ error: error.message })
  } else {
    const createdUserId = data.user.id
    await createUserProfile({ createdUserId, name, surname, gender, birthDate, affiliations, areasOfInterest })
    res.status(201).send({
      jwt: data.session.access_token,
      name: data.user.user_metadata.name,
      surname: data.user.user_metadata.surname
    })
  }
}

export async function googleRegister (req, res) {
  const { data, error } = await signUpGoogle()
  if (error?.status) {
    res.status(error.status).send({ error: error.message })
  } else {
    res.status(201).send({
      url: data.url
    })
  }
}

export async function quickRegister (req, res) {
  const { email } = req.body
  const existingUser = await UserProfile.findOne({ where: { email } })
  const existingEarlySignup = await EarlySignup.findOne({ where: { email } })
  if (existingUser !== null || existingEarlySignup !== null) {
    res.status(400).send({ error: 'Account with that email already registered.' })
  } else {
    await EarlySignup.create({ email })
    res.status(201).send({ message: 'Pre-registered successfully' })
  }
}

export async function removeQuickRegister (req, res) {
  const { email } = req.body
  const deletedEarlySignup = await EarlySignup.destroy({ where: { email } })
  return deletedEarlySignup !== 0
}

export async function getQuickRegister (email) {
  const quickRegister = await EarlySignup.findOne({ where: { email } })
  return quickRegister
}

export async function completeRegistration (req, res) {
  const quickRegiser = await getQuickRegister(req.body.email)
  if (!quickRegiser) {
    res.status(400).send({
      error: 'The email provided is not pre-registered.'
    })
  }
  await removeQuickRegister(req, res)
  if (!quickRegiser.isProvider) {
    await directRegister(req, res)
  } else {
    await completeProviderRegistration(req, res)
  }
}

const completeProviderRegistration = async (req, res) => {
  const { email } = req.body
  authBodyValidator(req, res)
  const existingUser = await UserProfile.findOne({ where: { email } })
  const existingUserId = existingUser.id
  const { name, surname, gender, birthDate, affiliations, areasOfInterest } = req.body
  await createUserProfile({ existingUserId, name, surname, gender, birthDate, affiliations, areasOfInterest })
  await googleRegister(req, res)
}

const createUserProfile = async (body) => {
  const createdUserProfile = await UserProfile.findByPk(body.createdUserId)
  if (createdUserProfile) {
    createdUserProfile.set(body)
    await createdUserProfile.save()
  }
  return createdUserProfile
}
