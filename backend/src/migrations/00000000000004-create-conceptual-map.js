'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  // Create the conceptual_maps table
  await queryInterface.createTable('conceptual_maps', {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    map: {
      type: Sequelize.JSON
    },
    isDelivered: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('conceptual_maps')
}
