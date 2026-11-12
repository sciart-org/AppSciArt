'use strict'
/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
  await queryInterface.renameColumn('hackathons', 'description', 'shortDescription')
}

export async function down (queryInterface) {
  await queryInterface.renameColumn('hackathons', 'shortDescription', 'description')
}
