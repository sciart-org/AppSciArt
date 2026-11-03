'use strict'

import { INTERNAL_ROLES } from '../../services/Roles.js'
import { seedUser, deleteSeededUser } from '../supabaseAdmin.js'

const PARTICIPANTS_PER_ROLE = 15
const ROLES = [...Object.values(INTERNAL_ROLES), { name: 'participant' }]

const SEED_USERS = ROLES.flatMap(role =>
  Array.from({ length: PARTICIPANTS_PER_ROLE }, (_, i) => ({
    email: `${role.name}${i + 1}@example.com`,
    password: role.name,
    fullName: { name: role.name, surname: `test ${i + 1}` },
    profileData: {
      gender: 'OTHER',
      ageRange: '25_34'
    },
    role
  }))
)

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await Promise.all(SEED_USERS.map(async (user) => {
    const { data, error } = await seedUser(user.email, user.password, user.fullName)
    if (error) {
      throw new Error(`Failed to seed user "${user.email}": ${error.message}`)
    }

    const [profile] = await queryInterface.bulkInsert(
      { tableName: 'user_profiles', schema: 'profiles' },
      [{
        id: Sequelize.literal('gen_random_uuid()'),
        authId: data.user.id,
        email: data.user.email,
        ...user.fullName,
        ...user.profileData
      }],
      { returning: ['id'] }
    )

    if (user.role?.models?.length) {
      await Promise.all(user.role.models.map(model =>
        queryInterface.bulkInsert(
          { tableName: model.getTableName().tableName, schema: model.getTableName().schema },
          [{
            id: Sequelize.literal('gen_random_uuid()'),
            userProfileId: profile.id
          }]
        )
      ))
    }
  }))
}

export async function down (queryInterface, Sequelize) {
  const [profiles] = await queryInterface.sequelize.query(
    'SELECT "id", "authId" FROM profiles.user_profiles WHERE "email" IN (:emails)',
    { replacements: { emails: SEED_USERS.map(user => user.email) } }
  )

  if (!profiles.length) return

  const profileIds = profiles.map(profile => profile.id)
  const roleModels = Object.values(INTERNAL_ROLES).flatMap(role => role.models)

  await Promise.all(
    roleModels.map(model =>
      queryInterface.bulkDelete(
        { tableName: model.getTableName().tableName, schema: model.getTableName().schema },
        { userProfileId: profileIds }
      )
    )
  )

  await queryInterface.bulkDelete({ tableName: 'user_profiles', schema: 'profiles' }, { id: profileIds })

  await Promise.all(
    profiles.filter(profile => profile.authId).map(async (profile) => {
      const { error } = await deleteSeededUser(profile.authId)
      if (error) {
        console.error(`✗ Failed to delete user (${profile.authId}): ${error.message}`)
      }
    })
  )
}
