'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Create the seeds table
  await queryInterface.createTable('seeds', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING
    },
    template: {
      type: DataTypes.STRING
    },
    mainImage: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.ENUM('IN_BLANK', 'IN_PROGRESS', 'IN_REVIEW', 'PUBLISHED'),
      allowNull: false,
      defaultValue: 'IN_BLANK'
    },
    branchesOfKnowledge: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    seedPDF: {
      type: DataTypes.STRING
    },
    videoLink: {
      type: DataTypes.STRING
    },
    presentationLink: {
      type: DataTypes.STRING
    },
    podcastLink: {
      type: DataTypes.STRING
    },
    driveLink: {
      type: DataTypes.STRING
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

  // Add unique index on title
  await queryInterface.addIndex('seeds', ['title'], {
    unique: true,
    name: 'seeds_title_unique'
  })
}

export async function down (queryInterface, Sequelize) {
  // Drop the table
  await queryInterface.dropTable('seeds')

  // Drop enum type
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_seeds_state";')
}
