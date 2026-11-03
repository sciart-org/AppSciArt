import { query } from './db.js'

export const BASE_ROLES = ['admin', 'designer', 'facilitator', 'participant']
export const BASE_USERS_PER_ROLE = 15

export const baseEmailPattern = (role) => `^${role}[0-9]+@example\\.com$`
export const anyBaseEmailPattern = baseEmailPattern(`(${BASE_ROLES.join('|')})`)

const baseUsersByEmail = new Map()

const roleInEmail = (email) => email.match(/^[a-z]+/)[0]

export const loadBaseUsers = async () => {
  const { rows } = await query(
    'SELECT id, "authId", email, name, surname FROM profiles.user_profiles WHERE email ~ $1',
    [anyBaseEmailPattern]
  )
  baseUsersByEmail.clear()
  for (const user of rows) {
    baseUsersByEmail.set(user.email, { ...user, password: roleInEmail(user.email) })
  }
}

const baseUser = (role, number = 1) => {
  if (!Number.isInteger(number) || number < 1 || number > BASE_USERS_PER_ROLE) {
    throw new Error(`Base users are numbered 1..${BASE_USERS_PER_ROLE}, got ${number}`)
  }
  const user = baseUsersByEmail.get(`${role}${number}@example.com`)
  if (!user) throw new Error(`Base user ${role}${number} is missing. Run "npm run db:seed:test".`)
  return { ...user }
}

export const administrator = (number) => baseUser('admin', number)
export const designer = (number) => baseUser('designer', number)
export const facilitator = (number) => baseUser('facilitator', number)
export const participant = (number) => baseUser('participant', number)

export const participants = (count, firstNumber = 1) =>
  Array.from({ length: count }, (_, offset) => participant(firstNumber + offset))
