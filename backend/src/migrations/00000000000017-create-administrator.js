'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Ensure schema exists
  await queryInterface.createSchema('profiles')

  // Create the administrators table
  await queryInterface.createTable(
    { tableName: 'administrators', schema: 'profiles' },
    {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      userProfileId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: { tableName: 'user_profiles', schema: 'profiles' },
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    }
  )

  // Add unique constraint on userProfileId
  await queryInterface.addConstraint(
    { tableName: 'administrators', schema: 'profiles' },
    {
      fields: ['userProfileId'],
      type: 'unique',
      name: 'administrators_userProfileId_unique'
    }
  )
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable({ tableName: 'administrators', schema: 'profiles' })
}
