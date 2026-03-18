'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Ensure schema exists
  await queryInterface.createSchema('profiles')

  // Create the early_signups table
  await queryInterface.createTable(
    { tableName: 'early_signups', schema: 'profiles' },
    {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      email: {
        type: Sequelize.STRING
      },
      isProvider: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    }
  )

  // Add unique index on email
  await queryInterface.addIndex(
    { tableName: 'early_signups', schema: 'profiles' },
    ['email'],
    {
      unique: true,
      name: 'early_signups_email_unique'
    }
  )
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable({ tableName: 'early_signups', schema: 'profiles' })
}
