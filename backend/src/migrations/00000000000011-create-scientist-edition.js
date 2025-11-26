'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('scientist_editions', {
    editionId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'editions',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    userProfileId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: { tableName: 'user_profiles', schema: 'profiles' },
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('scientist_editions')
}
