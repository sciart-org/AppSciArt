'use strict'
/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.removeColumn('flowers', 'conceptualMap')
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.addColumn('flowers', 'conceptualMap', {
    type: Sequelize.STRING
  })
}
