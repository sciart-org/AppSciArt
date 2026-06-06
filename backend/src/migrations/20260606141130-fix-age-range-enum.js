'use strict'

/** @type {import('sequelize-cli').Migration} */

export async function up (queryInterface) {
  const replacements = [
    ['18-24', '18_24'],
    ['25-34', '25_34'],
    ['35-44', '35_44'],
    ['45-54', '45_54'],
    ['55-64', '55_64']
  ]

  for (const [oldVal, newVal] of replacements) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "profiles"."enum_user_profiles_ageRange" RENAME VALUE '${oldVal}' TO '${newVal}';`
    )
  }
}

export async function down (queryInterface) {
  const replacements = [
    ['18_24', '18-24'],
    ['25_34', '25-34'],
    ['35_44', '35-44'],
    ['45_54', '45-54'],
    ['55_64', '55-64']
  ]

  for (const [oldVal, newVal] of replacements) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "profiles"."enum_user_profiles_ageRange" RENAME VALUE '${oldVal}' TO '${newVal}';`
    )
  }
}
