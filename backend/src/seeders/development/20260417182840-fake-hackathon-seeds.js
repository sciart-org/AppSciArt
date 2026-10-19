'use strict'

export async function up (queryInterface, Sequelize) {
  const hackathonIds = [
    '00000001-0000-0000-0000-000000000006'
    /*
    '00000001-0000-0000-0000-000000000007',
    '00000001-0000-0000-0000-000000000008',
    '00000001-0000-0000-0000-000000000009',
    '00000001-0000-0000-0000-000000000010',
    '00000001-0000-0000-0000-000000000011'
    */
  ]

  await queryInterface.bulkInsert('hackathon_seeds',
    hackathonIds.flatMap(hackathonId => [
      { seedId: '00000004-0000-0000-0000-000000000000', hackathonId },
      { seedId: '00000004-0000-0000-0000-000000000001', hackathonId },
      { seedId: '00000004-0000-0000-0000-000000000002', hackathonId },
      { seedId: '00000004-0000-0000-0000-000000000003', hackathonId },
      { seedId: '00000004-0000-0000-0000-000000000004', hackathonId }
    ])
    , {})
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('hackathon_seeds', {
    seedId: [
      '00000004-0000-0000-0000-000000000000',
      '00000004-0000-0000-0000-000000000001',
      '00000004-0000-0000-0000-000000000002',
      '00000004-0000-0000-0000-000000000003',
      '00000004-0000-0000-0000-000000000004'
    ]
  }, {})
}
