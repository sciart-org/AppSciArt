'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Ensure schema exists
  await queryInterface.createSchema('profiles')

  // Create the facilitators table
  await queryInterface.createTable(
    { tableName: 'facilitators', schema: 'profiles' },
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      userProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: { tableName: 'user_profiles', schema: 'profiles' },
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    }
  )

  // Add unique constraint on userProfileId
  await queryInterface.addConstraint(
    { tableName: 'facilitators', schema: 'profiles' },
    {
      fields: ['userProfileId'],
      type: 'unique',
      name: 'facilitators_userProfileId_unique'
    }
  )
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable({ tableName: 'facilitators', schema: 'profiles' })
}
