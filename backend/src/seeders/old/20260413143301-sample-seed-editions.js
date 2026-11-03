'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('seed_editions', [
    {
      seedId: '00000004-0000-0000-0000-000000000000',
      editionId: '00000000-0000-0000-0000-000000000003'
    },
    {
      seedId: '00000004-0000-0000-0000-000000000001',
      editionId: '00000000-0000-0000-0000-000000000003'
    },
    {
      seedId: '00000004-0000-0000-0000-000000000002',
      editionId: '00000000-0000-0000-0000-000000000003'
    },
    {
      seedId: '00000004-0000-0000-0000-000000000003',
      editionId: '00000000-0000-0000-0000-000000000003'
    },
    {
      seedId: '00000004-0000-0000-0000-000000000004',
      editionId: '00000000-0000-0000-0000-000000000003'
    }
  ], {})
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('seed_editions', {
    seedId: [
      '00000004-0000-0000-0000-000000000000',
      '00000004-0000-0000-0000-000000000001',
      '00000004-0000-0000-0000-000000000002',
      '00000004-0000-0000-0000-000000000003',
      '00000004-0000-0000-0000-000000000004'
    ]
  }, {})
}
