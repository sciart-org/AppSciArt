'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('hackathon_seeds', {
    hackathonId: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'hackathons',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    seedId: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'seeds',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('hackathon_seeds')
}
