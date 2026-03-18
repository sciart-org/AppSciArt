'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Create the editions table
  await queryInterface.createTable('editions', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    logo: {
      type: Sequelize.STRING
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    shortDescription: {
      type: Sequelize.STRING
    },
    longDescription: {
      type: Sequelize.TEXT
    },
    catalogLink: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.ENUM('PLANNED', 'ACTIVE', 'CLOSED', 'PUBLISHED'),
      allowNull: false,
      defaultValue: 'PLANNED'
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
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('editions')

  // Drop enum type
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_editions_state";')
}
