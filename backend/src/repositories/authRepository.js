import { EarlySignup } from '../models/EarlySignup.js'

export function preRegisterUser (email) {
  return EarlySignup.create({ email })
}

export function getPreRegistration (email) {
  return EarlySignup.findOne({ where: { email } })
}

export function getPreRegistrationById (id) {
  return EarlySignup.findByPk(id)
}

export function removePreRegistrationByEmail (email) {
  return EarlySignup.destroy({ where: { email } })
}
