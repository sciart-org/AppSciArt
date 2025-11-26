'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('seed_editions', {
    seedId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'seeds',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    editionId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'editions',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('seed_editions')
}
