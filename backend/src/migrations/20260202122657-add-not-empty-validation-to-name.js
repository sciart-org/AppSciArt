'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.changeColumn('editions', 'name', {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.changeColumn('editions', 'name', {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  })
}
