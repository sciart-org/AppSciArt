'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Create the editions table
  await queryInterface.createTable('editions', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shortDescription: {
      type: DataTypes.STRING
    },
    longDescription: {
      type: DataTypes.TEXT
    },
    catalogLink: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.ENUM('PLANNED', 'ACTIVE', 'CLOSED', 'PUBLISHED'),
      allowNull: false,
      defaultValue: 'PLANNED'
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
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('editions')

  // Drop enum type
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_editions_state";')
}
