'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.removeColumn('editions', 'logo')

  await queryInterface.addColumn('editions', 'driveLink', {
    type: DataTypes.STRING
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('editions', 'driveLink')

  await queryInterface.addColumn('editions', 'logo', {
    type: DataTypes.STRING
  })
}
