'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('seed_scientists', [
    {
      seedId: '00000004-0000-0000-0000-000000000000',
      userProfileId: '00000005-0000-0000-0000-000000000000'
    },
    {
      seedId: '00000004-0000-0000-0000-000000000001',
      userProfileId: '00000005-0000-0000-0000-000000000000'
    },
    {
      seedId: '00000004-0000-0000-0000-000000000002',
      userProfileId: '00000005-0000-0000-0000-000000000000'
    },
    {
      seedId: '00000004-0000-0000-0000-000000000003',
      userProfileId: '00000005-0000-0000-0000-000000000000'
    },
    {
      seedId: '00000004-0000-0000-0000-000000000004',
      userProfileId: '00000005-0000-0000-0000-000000000000'
    }
  ], {})
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('seed_scientists', {
    seedId: [
      '00000004-0000-0000-0000-000000000000',
      '00000004-0000-0000-0000-000000000001',
      '00000004-0000-0000-0000-000000000002',
      '00000004-0000-0000-0000-000000000003',
      '00000004-0000-0000-0000-000000000004'
    ]
  }, {})
}
