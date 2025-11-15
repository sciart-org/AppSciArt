import { EarlySignup } from '../models/EarlySignup.js'

export async function preRegisterUser (email) {
  return await EarlySignup.create({ email })
}

export async function getPreRegistration (email) {
  return await EarlySignup.findOne({ where: { email } })
}
