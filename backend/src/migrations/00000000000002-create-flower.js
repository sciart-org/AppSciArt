'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Create the flowers table
  await queryInterface.createTable('flowers', {
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
    concept: {
      type: DataTypes.TEXT
    },
    conceptualMap: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.ENUM('IN_BLANK', 'IN_PROGRESS', 'IN_REVIEW', 'PUBLISHED'),
      allowNull: false,
      defaultValue: 'IN_BLANK'
    },
    driveLink: {
      type: DataTypes.STRING
    },
    seedId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'seeds',
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
