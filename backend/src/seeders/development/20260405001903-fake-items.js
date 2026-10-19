'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  const userProfileIds = [
    '16df78a0-c87a-4dde-a87b-d14ec76041a1',
    '871418dd-0afb-4d27-adb0-e5ad6fda3d8c',
    'b31b8167-ed71-4d3f-912a-e6b513a58c90',
    'e2fbf798-5235-4796-9622-8e92ca020e97'
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
