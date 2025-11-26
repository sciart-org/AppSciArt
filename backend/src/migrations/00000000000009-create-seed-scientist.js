'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('seed_scientists', {
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

  await queryInterface.addIndex('seed_scientists', ['seedId', 'userProfileId'], {
    unique: true,
    name: 'seed_scientists_seedId_userProfileId_unique'
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('seed_scientists')
}
