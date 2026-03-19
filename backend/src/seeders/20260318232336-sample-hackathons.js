'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('hackathons', [
    {
      id: '00000001-0000-0000-0000-000000000000',
      internalName: 'On-site Environment Sevilla Hackathon',
      isPrivate: false,
      driveLink: 'https://drive.google.com/drive/folders/1WPva5TTultAUmQmFXDNYZUgtnRPTMOZ_',
      startDate: new Date('2023-03-13'),
      endDate: new Date('2023-03-15'),
      type: 'ON_SITE',
      location: 'Escuela Técnica Superior de Ingeniería Informática, Av. de la Reina Mercedes, s/n, 41012 Sevilla',
      description: 'On-site hackathon in Sevilla for the Environment edition.',
      state: 'FINISHED',
      phase: 'TEAM_WORK',
      meetLink: null,
      editionId: '00000000-0000-0000-0000-000000000000',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '00000001-0000-0000-0000-000000000002',
      internalName: 'On-site Sealife Sevilla Hackathon',
      isPrivate: false,
      driveLink: 'https://drive.google.com/drive/folders/1vxvwF0-EaarI7wX7BsxE7ySr-97TpYhy',
      startDate: new Date('2024-03-11'),
      endDate: new Date('2024-03-13'),
      type: 'ON_SITE',
      location: 'Escuela Técnica Superior de Ingeniería Informática, Av. de la Reina Mercedes, s/n, 41012 Sevilla',
      description: 'On-site hackathon in Sevilla for the Sealife edition.',
      state: 'FINISHED',
      phase: 'TEAM_WORK',
      meetLink: null,
      editionId: '00000000-0000-0000-0000-000000000001',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      id: '00000001-0000-0000-0000-000000000006',
      internalName: 'On-site Neuroscience Sevilla Hackathon',
      isPrivate: false,
      driveLink: 'https://drive.google.com/drive/folders/1vd5D6v1f53mY9OT4Q3F7V6Nm9DQjoc6a',
      startDate: new Date('2025-03-10'),
      endDate: new Date('2025-03-12'),
      type: 'ON_SITE',
      location: 'Escuela Técnica Superior de Ingeniería Informática, Av. de la Reina Mercedes, s/n, 41012 Sevilla',
      description: 'On-site hackathon in Sevilla for the Neuroscience edition.',
      state: 'FINISHED',
      phase: 'TEAM_WORK',
      meetLink: null,
      editionId: '00000000-0000-0000-0000-000000000002',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '00000001-0000-0000-0000-000000000005',
      internalName: 'On-site Neuroscience Linz Hackathon',
      isPrivate: false,
      driveLink: 'https://drive.google.com/drive/folders/1E6f3VQk99GZKWW406b5rc4_YUR3yMEqf',
      startDate: new Date('2025-04-07'),
      endDate: new Date('2025-04-09'),
      type: 'ON_SITE',
      location: 'University of Art and Design Linz, Domgasse 1, 4020 Linz, Austria',
      description: 'On-site hackathon in Linz for the Neuroscience edition.',
      state: 'FINISHED',
      phase: 'TEAM_WORK',
      meetLink: null,
      editionId: '00000000-0000-0000-0000-000000000002',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '00000001-0000-0000-0000-000000000004',
      internalName: 'Online Neuroscience Hackathon',
      isPrivate: false,
      driveLink: 'https://drive.google.com/drive/folders/14xIW9EfnR5IFJat7tQKMWLRFBl5qmGjw',
      startDate: new Date('2025-05-05'),
      endDate: new Date('2025-05-07'),
      type: 'ONLINE',
      description: 'Online hackathon for the Neuroscience edition.',
      state: 'FINISHED',
      phase: 'TEAM_WORK',
      meetLink: 'https://meet.example.com/neuroscience-online',
      editionId: '00000000-0000-0000-0000-000000000002',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '00000001-0000-0000-0000-000000000003',
      internalName: 'Dreamteam Neuroscience Hackathon',
      isPrivate: true,
      driveLink: 'https://drive.google.com/drive/folders/1J892QahTYDIrQ5P1TLPluyXwfouu-6GJ',
      startDate: new Date('2025-06-02'),
      endDate: new Date('2025-06-04'),
      type: 'HYBRID',
      location: 'Linz',
      description: 'Private hackathon for the Neuroscience edition organising team.',
      state: 'FINISHED',
      phase: 'TEAM_WORK',
      meetLink: 'https://meet.example.com/neuroscience-hybrid',
      editionId: '00000000-0000-0000-0000-000000000002',
      createdAt: new Date(),
      updatedAt: new Date()
    }

  ])
}

export async function down (queryInterface, Sequelize) {
  /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
}
