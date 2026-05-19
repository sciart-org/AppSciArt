'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  const userProfileIds = [
    'e4a07965-e4eb-4674-bbd4-4b81df4f9b2c',
    '9d84a3ac-46a1-4760-98c4-bf49d7638f68',
    'da12b6f6-abf6-4d69-9881-36c06c9c0d24',
    '1cdafd67-6cfc-4f00-942b-b22e4e01fddf',
    'b50658b8-5cab-4a1a-bd00-17f937376207'
  ]

  /*
  const userProfiles = userProfileIds.map((id, i) => ({
    id,
    email: `participant${i + 1}@gmail.com`,
    name: `Participant ${i + 1}`,
    surname: 'Test'
  }))

  await queryInterface.bulkInsert({ tableName: 'user_profiles', schema: 'profiles' }, userProfiles)
  */

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

  const participations = []

  hackathonIds.forEach((hackathonId, index) => {
    const padNum = String(index + 6).padStart(12, '0')

    const participationId = `50000001-0000-0000-0000-${padNum}`

    let count = 0

    userProfileIds.forEach(userProfileId => {
      const lastNum = String(index + 6 + count * 100).padStart(12, '0')

      participations.push({
        id: participationId.slice(0, -12) + lastNum,
        clusterNumber: 0,
        roles: [count % 2 === 0 ? 'Artist' : 'Technologist'],
        interests: 'Interested in art and science.',
        isGroupVoice: false,
        isTeamSpeaker: false,
        groupId: null,
        teamId: null,
        fruitId: null,
        userProfileId,
        hackathonId,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      count += 1
    })
  })

  await queryInterface.bulkInsert('participations', participations)
}

export async function down (queryInterface, Sequelize) {
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

  const paddedIds = hackathonIds.map((_, i) => String(i + 6).padStart(12, '0'))

  // Participations
  await queryInterface.bulkDelete('participations', { id: paddedIds.map(pad => `50000001-0000-0000-0000-${pad}`) })
}
