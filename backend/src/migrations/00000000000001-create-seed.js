'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Create the seeds table
  await queryInterface.createTable('seeds', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    title: {
      type: Sequelize.STRING
    },
    template: {
      type: Sequelize.STRING
    },
    mainImage: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.ENUM('IN_BLANK', 'IN_PROGRESS', 'IN_REVIEW', 'PUBLISHED'),
      allowNull: false,
      defaultValue: 'IN_BLANK'
    },
    branchesOfKnowledge: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    seedPDF: {
      type: Sequelize.STRING
    },
    videoLink: {
      type: Sequelize.STRING
    },
    presentationLink: {
      type: Sequelize.STRING
    },
    podcastLink: {
      type: Sequelize.STRING
    },
    driveLink: {
      type: Sequelize.STRING
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
