'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.addColumn('participations', 'hasConfirmedAssistance', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  })
}

export async function down (queryInterface) {
  await queryInterface.removeColumn('participations', 'hasConfirmedAssistance')
}
