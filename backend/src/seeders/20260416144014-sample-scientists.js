'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert({ tableName: 'user_profiles', schema: 'profiles' },
    [
      {
        id: '00000005-0000-0000-0000-000000000000',
        email: 'guillermoantiñolo@test.com',
        name: 'Guillermo',
        surname: 'Antiñolo'
      }
    ], {})

  await queryInterface.bulkInsert('scientist_editions', [
    {
      editionId: '00000000-0000-0000-0000-000000000003',
      userProfileId: '00000005-0000-0000-0000-000000000000'
    }
  ], {})
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('scientist_editions', {
    userProfileId: [
      '00000005-0000-0000-0000-000000000000'
    ]
  }, {})

  await queryInterface.bulkDelete({ tableName: 'user_profiles', schema: 'profiles' },
    {
      id: [
        '00000005-0000-0000-0000-000000000000'
      ]
    }, {})
}
