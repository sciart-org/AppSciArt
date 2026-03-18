'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Create the flowers table
  await queryInterface.createTable('flowers', {
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
    concept: {
      type: Sequelize.TEXT
    },
    conceptualMap: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.ENUM('IN_BLANK', 'IN_PROGRESS', 'IN_REVIEW', 'PUBLISHED'),
      allowNull: false,
      defaultValue: 'IN_BLANK'
    },
    driveLink: {
      type: Sequelize.STRING
    },
    seedId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'seeds',
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

  // Add unique index on title
  await queryInterface.addIndex('flowers', ['title'], {
    unique: true,
    name: 'flowers_title_unique'
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('flowers')

  // Drop enum type
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_flowers_state";')
}
