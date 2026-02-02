'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.sequelize.query(
    'DROP INDEX IF EXISTS profiles.user_profiles_email_unique;'
  )
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.sequelize.query(
    'CREATE UNIQUE INDEX user_profiles_email_unique ON profiles.user_profiles USING btree (email);'
  )
}
