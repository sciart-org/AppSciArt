import { signInEmail } from '../auth/signin.js'
import { signUpEmail, signUpGoogle } from '../auth/signup.js'
import { UserProfile } from '../models/UserProfile.js'

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

export async function register (req, res) {
  const { method } = req.query
  if (method === 'complete') {
    await completeRegister(req, res)
  } else if (method === 'quick') {
    res.status(500).send({
      message: 'Quick registration not yet implemented'
    })
  } else {
    res.status(500).send({
      message: 'Invalid method'
    })
  }
}

export async function registerProvider (req, res) {
  const { provider } = req.query
  if (provider === 'google') {
    await googleRegister(req, res)
  } else {
    res.status(500).send({
      message: 'Invalid provider'
    })
  }
}

const completeRegister = async (req, res) => {
  const { email, password, name, surname, gender, birthDate, affiliations, areasOfInterest } = req.body

  if (gender !== null) validateGender(gender, res)
  if (affiliations !== null) validateAffiliations(affiliations, res)
  if (areasOfInterest !== null) validateAreasOfInterest(areasOfInterest, res)

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

const validateEnumValues = (toValidate, possibleValues, property, res) => {
  if (!possibleValues.includes(toValidate)) {
    res.status(400).send({ error: 'Invalid value for property ' + property })
  }
}

const validateEnumList = (toValidate, possibleValues, property, res) => {
  for (let v = 0; v < toValidate.length; v = v + 1) {
    validateEnumValues(toValidate[v], possibleValues, property, res)
    possibleValues.pop(toValidate[v])
  }
}

const validateGender = (gender, res) => {
  const acceptedGenders = ['male', 'female', 'other', 'prefer not to say']
  validateEnumValues(gender, acceptedGenders, 'gender', res)
}

const validateAffiliations = (affiliations, res) => {
  const acceptedAffiliations = ['university', 'company', 'association', 'freelance', 'other']
  validateEnumList(affiliations, acceptedAffiliations, 'affiliations', res)
}

const validateAreasOfInterest = (areasOfInterest, res) => {
  const acceptedAreas = ['art', 'pure sciences', 'science applications', 'it', 'Others']
  validateEnumList(areasOfInterest, acceptedAreas, 'areasOfInterest', res)
}

const createUserProfile = async (body) => {
  const createdUserProfile = await UserProfile.findByPk(body.createdUserId)
  if (createdUserProfile) {
    createdUserProfile.set(body)
    await createdUserProfile.save()
  }
  return createdUserProfile
}

const googleRegister = async (req, res) => {
  const { data, error } = await signUpGoogle()
  if (error?.status) {
    res.status(error.status).send({ error: error.message })
  } else {
    res.status(201).send({
      url: data.url
    })
  }
}
