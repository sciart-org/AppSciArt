'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Create the fruits table
  await queryInterface.createTable('fruits', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    title: {
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
    authorVision: {
      type: Sequelize.TEXT
    },
    curatorVision: {
      type: Sequelize.TEXT
    },
    seedDescription: {
      type: Sequelize.TEXT
    },
    driveLink: {
      type: Sequelize.STRING
    },
    flowerId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'flowers',
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
  await queryInterface.addIndex('fruits', ['title'], {
    unique: true,
    name: 'fruits_title_unique'
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('fruits')

  // Drop enum type
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_fruits_state";')
}
