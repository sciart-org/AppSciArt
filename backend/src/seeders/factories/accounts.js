import { randomUUID } from 'crypto'
import { seedUser, deleteSeededUser } from '../supabaseAdmin.js'

export const PROFILES_TABLE = { tableName: 'user_profiles', schema: 'profiles' }

const sampleUsersPassword = () => {
  const password = process.env.SAMPLE_USERS_PASSWORD
  if (!password) throw new Error('Set SAMPLE_USERS_PASSWORD in the env file to seed sample users')
  return password
}

export const createAccount = async (queryInterface, { email, name, surname, gender, ageRange, roleTable }) => {
  const { data, error } = await seedUser(email, sampleUsersPassword(), { name, surname })
  if (error) throw new Error(`Failed to seed user "${email}": ${error.message}`)

  const profileId = randomUUID()
  await queryInterface.bulkInsert(PROFILES_TABLE, [{ id: profileId, authId: data.user.id, email, name, surname, gender, ageRange }])
  if (roleTable) await queryInterface.bulkInsert(roleTable, [{ id: randomUUID(), userProfileId: profileId }])
}

const findProfiles = async (queryInterface, emails) => {
  const [profiles] = await queryInterface.sequelize.query(
    'SELECT "id", "authId", "email" FROM profiles.user_profiles WHERE "email" IN (:emails)',
    { replacements: { emails } }
  )
  return profiles
}

export const profileIdsByEmail = async (queryInterface, emails) => {
  const profiles = await findProfiles(queryInterface, emails)
  return Object.fromEntries(profiles.map(profile => [profile.email, profile.id]))
}

export const deleteAccounts = async (queryInterface, emails) => {
  const profiles = await findProfiles(queryInterface, emails)
  if (!profiles.length) return

  await queryInterface.bulkDelete(PROFILES_TABLE, { id: profiles.map(profile => profile.id) })
  await Promise.all(profiles.filter(profile => profile.authId).map(async (profile) => {
    const { error } = await deleteSeededUser(profile.authId)
    if (error) console.error(`✗ Failed to delete user ${profile.email}: ${error.message}`)
  }))
}
