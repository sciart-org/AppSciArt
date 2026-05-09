'use strict'
/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.removeColumn('flowers', 'template')
  await queryInterface.removeColumn('seeds', 'template')
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.addColumn('flowers', 'template', {
    type: Sequelize.STRING
  })
  await queryInterface.addColumn('seeds', 'template', {
    type: Sequelize.STRING
  })
}
