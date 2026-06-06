import * as service from '../services/authService.js'
import { errorThrower } from '../services/errorThrower.js'
import { authBodyValidator } from '../validators/authValidators.js'
import { checkExists } from '../validators/generalValidators.js'
import { withController } from './controllerHandlers.js'
import * as scientistsService from '../services/scientistsService.js'
import * as usersService from '../services/usersService.js'
import * as emailService from '../emails/emailService.js'

export const login = withController(async (req, res, addAfterCommit) => {
  const { email, password } = req.body
  const result = await service.login({ email, password })
  return res.status(201).send(result)
})

export const register = withController(async (req, res) => {
  const { method } = req.query

  if (method === 'direct') {
    const validationError = authBodyValidator(req.body)
    errorThrower(checkExists(validationError), validationError, 400)

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

export const registerProvider = withController(async (req, res) => {
  const { provider } = req.query

  if (provider === 'google') {
    const result = await service.googleRegister()
    return res.status(201).send(result)
  }

  return res.status(400).send({
    message: 'Invalid provider or provider not yet implemented'
  })
})

export const completeRegistration = withController(async (req, res) => {
  const validationError = authBodyValidator(req.body)
  errorThrower(checkExists(validationError), validationError, 400)

  const result = await service.completeRegistration(getBodyAttributes(req))
  await service.removeEarlySignupByEmail(req.body.email)
  const createdUser = await usersService.getUserProfileByEmail(req.body.email)
  const hasBeenInvited = await scientistsService.completeScientistInvitationIfPresent(createdUser)
  if (hasBeenInvited) {
    result.roles = await usersService.getUserRoles(createdUser.id)
  }
  emailService.sendCompleteRegistrationEmail(req.body.email, createdUser.name)
  return res.status(201).send(result)
})

export const getEarlySignup = withController(async (req, res) => {
  const result = await service.getEarlySignup(req.params.earlySignupId)
  return res.status(200).send(result)
})
