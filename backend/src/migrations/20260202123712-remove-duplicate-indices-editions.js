'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.removeConstraint(
    'editions',
    'editions_name_key'
  )

  await queryInterface.removeConstraint(
    'editions',
    'unique_editions_name'
  )
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.addConstraint(
    'editions',
    {
      fields: ['name'],
      type: 'unique',
      name: 'unique_editions_name'
    }
  )

  await queryInterface.addConstraint(
    'editions',
    {
      fields: ['name'],
      type: 'unique',
      name: 'editions_name_key'
    }
  )
}
