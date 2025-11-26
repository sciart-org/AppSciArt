'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Create the fruits table
  await queryInterface.createTable('fruits', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
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
    authorVision: {
      type: DataTypes.TEXT
    },
    curatorVision: {
      type: DataTypes.TEXT
    },
    seedDescription: {
      type: DataTypes.TEXT
    },
    driveLink: {
      type: DataTypes.STRING
    },
    flowerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'flowers',
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
