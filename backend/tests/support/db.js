import pg from 'pg'
import { BASE_ROLES, BASE_USERS_PER_ROLE, anyBaseEmailPattern, baseEmailPattern } from './users.js'

let client

const connectedClient = async () => {
  if (!client) {
    client = new pg.Client({ connectionString: process.env.DATABASE_URL })
    await client.connect()
  }
  return client
}

export const query = async (text, params) => (await connectedClient()).query(text, params)

export const closeDb = async () => {
  await client?.end()
  client = undefined
}

const STAFF_ROLE_TABLES = {
  admin: 'profiles.administrators',
  designer: 'profiles.designers',
  facilitator: 'profiles.facilitators'
}

const deleteAllDomainData = () => query(`
  TRUNCATE public.editions, public.seeds, public.scientist_invitations,
    profiles.evaluators, profiles.early_signups CASCADE`)

const deleteUsersCreatedByTests = async () => {
  await query('DELETE FROM auth.users WHERE email !~ $1', [anyBaseEmailPattern])
  await query('DELETE FROM profiles.user_profiles WHERE email !~ $1', [anyBaseEmailPattern])
}

const restoreBaseStaffRoles = async () => {
  for (const [role, table] of Object.entries(STAFF_ROLE_TABLES)) {
    await query(`
      DELETE FROM ${table} roles USING profiles.user_profiles users
      WHERE roles."userProfileId" = users.id AND users.email !~ $1`, [baseEmailPattern(role)])
    await query(`
      INSERT INTO ${table} (id, "userProfileId")
      SELECT gen_random_uuid(), users.id FROM profiles.user_profiles users
      WHERE users.email ~ $1
        AND NOT EXISTS (SELECT 1 FROM ${table} roles WHERE roles."userProfileId" = users.id)`, [baseEmailPattern(role)])
  }
}

const assertBaseUsersArePresent = async () => {
  const { rows: [{ count }] } = await query(
    'SELECT count(*)::int AS count FROM profiles.user_profiles WHERE email ~ $1', [anyBaseEmailPattern])
  const expected = BASE_ROLES.length * BASE_USERS_PER_ROLE
  if (count !== expected) {
    throw new Error(`Expected ${expected} base users in the testing DB, found ${count}. Run "npm run db:seed:test".`)
  }
}

export const resetDatabase = async () => {
  await deleteAllDomainData()
  await deleteUsersCreatedByTests()
  await restoreBaseStaffRoles()
  await assertBaseUsersArePresent()
}
