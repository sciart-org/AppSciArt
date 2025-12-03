'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.changeColumn('editions', 'name', {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  })

  await queryInterface.addConstraint('editions', {
    fields: ['name'],
    type: 'unique',
    name: 'unique_editions_name'
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.removeConstraint('editions', 'unique_editions_name')

  await queryInterface.changeColumn('editions', 'name', {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  })
}
