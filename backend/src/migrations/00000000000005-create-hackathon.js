'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Create the hackathons table
  await queryInterface.createTable('hackathons', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    logo: {
      type: DataTypes.STRING
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    },
    type: {
      type: DataTypes.ENUM('ON_SITE', 'ONLINE', 'HYBRID'),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.ENUM('PLANNED', 'OPEN', 'CLOSED', 'FINISHED'),
      allowNull: false,
      defaultValue: 'PLANNED'
    },
    phase: {
      type: DataTypes.ENUM('PREPARING', 'GROUP_CREATION', 'GROUP_WORK', 'GROUP_PRESENTATION', 'TEAM_CREATION', 'TEAM_WORK'),
      allowNull: false,
      defaultValue: 'PREPARING'
    },
    meetLink: {
      type: DataTypes.STRING
    },
    editionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'editions',
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
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('hackathons')

  // Drop enums
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_hackathons_type";')
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_hackathons_state";')
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_hackathons_phase";')
}
