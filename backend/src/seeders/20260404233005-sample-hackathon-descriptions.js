'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('hackathon_descriptions', [
    {
      id: '00000002-0000-0000-0000-000000000000',
      sectionName: 'Previous Webinars',
      text: `(January 10, 2025) Webinar (online) with MARÍA PTK.

(January 20, 2025) Webinar (online) with Paula Bruna and Raquel Ajetes.

Participate in the live webinars with María PTQK, Paula Bruna, and Raquel Ajetes, experts in the field of SciArt. In these webinars, we will present the ASTER+S project and provide an introduction to the eco-SciArt methodology.`,
      position: 0,
      hackathonId: '00000001-0000-0000-0000-000000000006'
    },
    {
      id: '00000002-0000-0000-0000-000000000001',
      sectionName: '1st day of hackathon',
      text: 'Meet the participants + Develop a common understanding of the "SciArt Seeds" + Create interdisciplinary teams.',
      position: 1,
      hackathonId: '00000001-0000-0000-0000-000000000006'
    },
    {
      id: '00000002-0000-0000-0000-000000000002',
      sectionName: '2nd day of hackathon',
      text: 'Brainstorming to develop the artistic concept and create the SciArt proposal, which we call "SciArt Flowers."',
      position: 2,
      hackathonId: '00000001-0000-0000-0000-000000000006'
    },
    {
      id: '00000002-0000-0000-0000-000000000003',
      sectionName: '3rd day of hackathon',
      text: 'Presentación de los proyectos «Flores SciArt» en formato de vídeo (de 3 min de duración).',
      position: 3,
      hackathonId: '00000001-0000-0000-0000-000000000006'
    },
    {
      id: '00000002-0000-0000-0000-000000000004',
      sectionName: 'After the hackathon',
      text: `For three months, the interdisciplinary creative teams will develop their final works of art. Thus, the flowers will transform into the "fruits of SciArt."

The selected "SciArt Flowers" will be part of a collective exhibition that will open before the summer of 2025. The exhibition will invite visitors to immerse themselves in the artistic installations, not only enjoying them but also exploring the profound scientific and humanistic dimensions that inspire them.

A selection from this exhibition may be displayed during the Ars Electronica Festival in Linz, Austria.`,
      position: 4,
      hackathonId: '00000001-0000-0000-0000-000000000006'
    }
  ])
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('hackathon_descriptions', {
    id: [
      '00000002-0000-0000-0000-000000000000',
      '00000002-0000-0000-0000-000000000001',
      '00000002-0000-0000-0000-000000000002',
      '00000002-0000-0000-0000-000000000003',
      '00000002-0000-0000-0000-000000000004'
    ]
  }, {})
}
