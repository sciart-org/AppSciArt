import * as service from '../services/authService.js'
import { authBodyValidator } from '../validators/authValidators.js'
import { withErrorHandler } from './errorHandling.js'

export const login = withErrorHandler(async (req, res) => {
  const { email, password } = req.body
  const result = await service.login({ email, password })
  return res.status(201).send(result)
})

export const register = withErrorHandler(async (req, res) => {
  const { method } = req.query

  if (method === 'direct') {
    const validationError = authBodyValidator(req.body)
    if (validationError) {
      return res.status(400).send({ error: validationError })
    }

    const result = await service.directRegister(getBodyAttributes(req))
    return res.status(201).send(result)
  }

  if (method === 'quick') {
    const result = await service.quickRegister(req.body.email)
    return res.status(201).send(result)
  }

  return res.status(400).send({
    message: 'Invalid method or method not yet implemented'
  })
})

const getBodyAttributes = (req) => {
  const { email, password, name, surname, gender, ageRange, affiliations, areasOfInterest } = req.body
  return { email, password, name, surname, gender, ageRange, affiliations, areasOfInterest }
}

export const registerProvider = withErrorHandler(async (req, res) => {
  const { provider } = req.query

  if (provider === 'google') {
    const result = await service.googleRegister()
    return res.status(201).send(result)
  }

  return res.status(400).send({
    message: 'Invalid provider or provider not yet implemented'
  })
})

export const completeRegistration = withErrorHandler(async (req, res) => {
  const validationError = authBodyValidator(req.body)
  if (validationError) {
    return res.status(400).send({ error: validationError })
  }
  const result = await service.completeRegistration(getBodyAttributes(req))
  await service.removeEarlySignupByEmail(req.body.email)
  return res.status(201).send(result)
})

export const getEarlySignup = withErrorHandler(async (req, res) => {
  const result = await service.getEarlySignup(req.params.earlySignupId)
  return res.status(200).send(result)
})
