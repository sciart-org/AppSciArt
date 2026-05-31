'use strict'
/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.removeColumn('seeds', 'mainImage')
  await queryInterface.removeColumn('flowers', 'mainImage')
  await queryInterface.removeColumn('fruits', 'mainImage')
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.addColumn('seeds', 'mainImage', { type: Sequelize.STRING })
  await queryInterface.addColumn('flowers', 'mainImage', { type: Sequelize.STRING })
  await queryInterface.addColumn('fruits', 'mainImage', { type: Sequelize.STRING })
}
