'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('app_configs', {
    key: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    value: {
      type: Sequelize.TEXT,
      allowNull: true
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
  await queryInterface.dropTable('app_configs')
}
