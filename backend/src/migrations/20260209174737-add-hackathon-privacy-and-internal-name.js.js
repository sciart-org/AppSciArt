'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.addColumn('hackathons', 'internalName', {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  })

  await queryInterface.addColumn('hackathons', 'isPrivate', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })

  await queryInterface.addColumn('hackathons', 'driveLink', {
    type: Sequelize.STRING,
    allowNull: true
  })

  await queryInterface.removeColumn('hackathons', 'logo')
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.addColumn('hackathons', 'logo', {
    type: Sequelize.STRING,
    allowNull: true
  })

  await queryInterface.removeColumn('hackathons', 'driveLink')
  await queryInterface.removeColumn('hackathons', 'isPrivate')
  await queryInterface.removeColumn('hackathons', 'internalName')
}
