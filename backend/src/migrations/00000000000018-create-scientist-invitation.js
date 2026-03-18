'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Create the scientist_invitations table in public schema
  await queryInterface.createTable(
    { tableName: 'scientist_invitations', schema: 'public' },
    {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      seedId: {
        type: Sequelize.UUID,
        references: {
          model: 'seeds',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      editionId: {
        type: Sequelize.UUID,
        references: {
          model: 'editions',
          key: 'id'
        },
        onDelete: 'SET NULL'
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

  // Add unique index on combination of email, seedId, editionId
  await queryInterface.addIndex(
    { tableName: 'scientist_invitations', schema: 'public' },
    ['email', 'seedId', 'editionId'],
    {
      unique: true,
      name: 'scientist_invitations_unique_email_seed_edition'
    }
  )
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable({ tableName: 'scientist_invitations', schema: 'public' })
}
