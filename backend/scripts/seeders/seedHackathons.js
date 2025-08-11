import { Hackathon } from '../../src/models/Hackathon.js'
import { HackathonSeeds } from '../../src/models/intermediate/HackathonSeeds.js'

export async function seedHackathons () {
  await Hackathon.bulkCreate([
    {
      id: '00000000-0000-0006-0000-000000000000',
      logo: 'https://i.imgur.com/QCm4N6t.png',
      startDate: '2025-01-22',
      endDate: '2025-01-24',
      type: 'ON_SITE',
      location: 'University of Arts Linz, Hauptplatz 8, Lecture Theater, 4th Floor (Altenberger Str. 69, 4040 Linz, Austria).',
      description: 'Explore the boundaries of art and science around the brain and cognition, developing new ways to understand the human mind',
      state: 'CLOSED',
      meetLink: null,
      editionId: '00000000-0000-0003-0000-000000000002'
    },
    {
      id: '00000000-0000-0006-0000-000000000001',
      logo: 'https://i.imgur.com/QCm4N6t.png',
      startDate: '2025-01-29',
      endDate: '2025-01-31',
      type: 'ON_SITE',
      location: 'Escuela Técnica Superior de Ingeniería Informática de la Universidad de Sevilla (Av. Reina Mercedes s/n, 41012 Sevilla, Spain)',
      description: 'Explore the boundaries of art and science around the brain and cognition, developing new ways to understand the human mind',
      state: 'PLANNED',
      meetLink: null,
      editionId: '00000000-0000-0003-0000-000000000002'
    },
    {
      id: '00000000-0000-0006-0000-000000000002',
      logo: 'https://i.imgur.com/1SXlGNQ.png',
      startDate: '2023-01-24',
      endDate: '2023-01-26',
      type: 'ON_SITE',
      location: 'Escuela Técnica Superior de Ingeniería Informática de la Universidad de Sevilla (Av. Reina Mercedes s/n, 41012 Sevilla, Spain)',
      description: 'Explore the boundaries of art and science around the brain and cognition, developing new ways to understand the human mind',
      state: 'FINISHED',
      meetLink: null,
      editionId: '00000000-0000-0003-0000-000000000000'
    },
    {
      id: '00000000-0000-0006-0000-000000000003',
      logo: 'https://i.imgur.com/QCm4N6t.png',
      startDate: '2026-01-22',
      endDate: '2026-01-24',
      type: 'ON_SITE',
      location: 'University of Arts Linz, Hauptplatz 8, Lecture Theater, 4th Floor (Altenberger Str. 69, 4040 Linz, Austria).',
      description: 'Explore the boundaries of art and science around the brain and cognition, developing new ways to understand the human mind',
      state: 'OPEN',
      meetLink: null,
      editionId: '00000000-0000-0003-0000-000000000002'
    }
  ])

  await HackathonSeeds.bulkCreate([
    {
      hackathonId: '00000000-0000-0006-0000-000000000000',
      seedId: '00000000-0000-0005-0000-000000000000'
    },
    {
      hackathonId: '00000000-0000-0006-0000-000000000001',
      seedId: '00000000-0000-0005-0000-000000000000'
    },
    {
      hackathonId: '00000000-0000-0006-0000-000000000003',
      seedId: '00000000-0000-0005-0000-000000000000'
    },
    {
      hackathonId: '00000000-0000-0006-0000-000000000000',
      seedId: '00000000-0000-0005-0000-000000000001'
    },
    {
      hackathonId: '00000000-0000-0006-0000-000000000001',
      seedId: '00000000-0000-0005-0000-000000000001'
    },
    {
      hackathonId: '00000000-0000-0006-0000-000000000003',
      seedId: '00000000-0000-0005-0000-000000000001'
    },
    {
      hackathonId: '00000000-0000-0006-0000-000000000002',
      seedId: '00000000-0000-0005-0000-000000000008'
    }
  ])
}
