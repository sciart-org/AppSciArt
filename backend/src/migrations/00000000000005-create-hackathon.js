'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Create the hackathons table
  await queryInterface.createTable('hackathons', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    logo: {
      type: Sequelize.STRING
    },
    startDate: {
      type: Sequelize.DATE
    },
    endDate: {
      type: Sequelize.DATE
    },
    type: {
      type: Sequelize.ENUM('ON_SITE', 'ONLINE', 'HYBRID'),
      allowNull: false
    },
    location: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.ENUM('PLANNED', 'OPEN', 'CLOSED', 'FINISHED'),
      allowNull: false,
      defaultValue: 'PLANNED'
    },
    phase: {
      type: Sequelize.ENUM('PREPARING', 'GROUP_CREATION', 'GROUP_WORK', 'GROUP_PRESENTATION', 'TEAM_CREATION', 'TEAM_WORK'),
      allowNull: false,
      defaultValue: 'PREPARING'
    },
    meetLink: {
      type: Sequelize.STRING
    },
    editionId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'editions',
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
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('hackathons')

  // Drop enums
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_hackathons_type";')
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_hackathons_state";')
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_hackathons_phase";')
}
