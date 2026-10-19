'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('editions', [
    {
      id: '00000000-0000-0000-0000-000000000010',
      name: 'ASTER+S > ASTRONOMICS',
      year: 2026,
      driveLink: 'https://drive.google.com/drive/folders/188T_5cdg2mv0D1b4UvlIEoI7ZiNqifRJ',
      shortDescription: 'Exploring the intersection of environmental challenges and artificial intelligence through interdisciplinary SciArt collaboration, establishing new ways to combine artistic and scientific knowledge.',
      state: 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  /*
  const phases = ['PREPARING', 'GROUP_CREATION', 'GROUP_WORK', 'GROUP_PRESENTATION', 'TEAM_CREATION', 'TEAM_WORK']
  const padId = (num) => String(num).padStart(12, '0')

  const hackathons = phases.map((phase, index) => ({
    id: `00000001-0000-0000-0000-${padId(index + 6)}`,
    internalName: `Fake Hackathon ${index + 1}, phase: ${phase}`,
    isPrivate: false,
    driveLink: null,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2027-01-01'),
    type: 'ONLINE',
    location: `Virtual Location ${index + 1}`,
    description: `This is a fake hackathon in phase ${phase}.`,
    state: 'CLOSED',
    phase,
    meetLink: `https://meet.example.com/fake-${index + 1}`,
    editionId: '00000000-0000-0000-0000-000000000003',
    createdAt: new Date(),
    updatedAt: new Date()
  }))
  */

  const hackathons = [{
    id: `00000001-0000-0000-0000-${String(6).padStart(12, '0')}`,
    internalName: 'ASTER+S > ASTRONOMICS - HYBRID HACKATHON',
    isPrivate: false,
    driveLink: 'https://drive.google.com/drive/folders/1-HNWnjQwB1RYIL7ydRZ3F5Q6eBZtR6BC',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2027-01-01'),
    type: 'HYBRID',
    location: 'Escuela Técnica Superior de Ingeniería Informática, Av. de la Reina Mercedes, s/n, 41012 Sevilla',
    description: 'Hybrid hackathon in Sevilla for the ASTER+S Astronomics edition.',
    state: 'CLOSED',
    phase: 'PREPARING',
    meetLink: 'https://meet.example.com/hybrid-astronomics',
    editionId: '00000000-0000-0000-0000-000000000010',
    createdAt: new Date(),
    updatedAt: new Date()
  }]

  await queryInterface.bulkInsert('hackathons', hackathons)
}

export async function down (queryInterface, Sequelize) {
  /*
  await queryInterface.bulkDelete('hackathons', {
    id: [
      '00000001-0000-0000-0000-000000000006',
      '00000001-0000-0000-0000-000000000007',
      '00000001-0000-0000-0000-000000000008',
      '00000001-0000-0000-0000-000000000009',
      '00000001-0000-0000-0000-000000000010',
      '00000001-0000-0000-0000-000000000011'
    ]
  }, {})
  */

  await queryInterface.bulkDelete('hackathons', {
    id: [
      '00000001-0000-0000-0000-000000000006'
    ]
  }, {})
  await queryInterface.bulkDelete('editions', {
    id: [
      '00000000-0000-0000-0000-000000000010'
    ]
  }, {})
}
