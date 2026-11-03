'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.bulkInsert('seeds', [
    {
      id: '00000004-0000-0000-0000-000000000000',
      title: 'Del Gen al Paciente: cartografías de la decisión clínica',
      state: 'PUBLISHED',
      branchesOfKnowledge: ['Medicine', 'Genomics', 'Bio-informatics'],
      seedPDF: 'https://drive.google.com/file/d/1xS9fZ5Iufu4ThBzbsFUbktrXXQ9ZLTME/preview?usp=sharing',
      presentationLink: 'https://docs.google.com/presentation/d/1gBwZyJiNeMVhF-WO7BQ3_rPdOZQzilhx/preview?usp=sharing&ouid=112485687551038534612&rtpof=true&sd=true'
    },
    {
      id: '00000004-0000-0000-0000-000000000001',
      title: 'Datos que curan: Cartografías de Big Data en Medicina de Precisión',
      state: 'PUBLISHED',
      branchesOfKnowledge: ['Medicine', 'Biomedical Informatics', 'Bio-informatics'],
      seedPDF: 'https://drive.google.com/file/d/1qtbqE3qL_g0P5UzRjtlaIUxHNel5v_X0/preview?usp=sharing',
      presentationLink: 'https://docs.google.com/presentation/d/1XINYSF49ow4dBWA6e_u13ipnVstD6qV2/preview?usp=sharing&ouid=112485687551038534612&rtpof=true&sd=true'
    },
    {
      id: '00000004-0000-0000-0000-000000000002',
      title: 'Genes bajo sospecha: genética, cáncer y medicina personalizada',
      state: 'PUBLISHED',
      branchesOfKnowledge: ['Medicine', 'Genetics', 'Oncology', 'Epidemiology'],
      seedPDF: 'https://drive.google.com/file/d/1TTy3pdlAGRN99v-N_pQSlYCxn9eoxmG0/preview?usp=sharing',
      presentationLink: 'https://docs.google.com/presentation/d/1iqW18svL2ZWqyptYnld3pzQqLVN_mM8f/preview?usp=sharing&ouid=112485687551038534612&rtpof=true&sd=true'
    },
    {
      id: '00000004-0000-0000-0000-000000000003',
      title: 'Genómica Reproductiva y Datos Del Mundo Real: del riesgo biológico a la decisión clínica',
      state: 'PUBLISHED',
      branchesOfKnowledge: ['Medicine', 'Genomics', 'Reproductive Health', 'Clinical Epidemiology'],
      seedPDF: 'https://drive.google.com/file/d/1kM0GDsBPZ8kCEdbYdl4iygb047aAJ8GO/preview?usp=sharing',
      presentationLink: 'https://docs.google.com/presentation/d/1t5V5zuyECVEdq55GeKvl5vMREXiTrDHT/preview?usp=sharing&ouid=112485687551038534612&rtpof=true&sd=true'
    },
    {
      id: '00000004-0000-0000-0000-000000000004',
      title: 'CRISPR: Editar lo vivo: terapias génicas entre precisión y responsabilidad',
      state: 'PUBLISHED',
      branchesOfKnowledge: ['Medicine', 'Genomics', 'Bio-informatics'],
      seedPDF: 'https://drive.google.com/file/d/1j698-rIjEXdwHAumwxAkiXcRDH9oVOzL/preview?usp=sharing',
      presentationLink: 'https://docs.google.com/presentation/d/1rVO_b-WCAsgS1iLcpvh_7cg_HnXlf9Mn/preview?usp=sharing&ouid=112485687551038534612&rtpof=true&sd=true'
    }
  ], {})
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('seeds', {
    id: [
      '00000004-0000-0000-0000-000000000000',
      '00000004-0000-0000-0000-000000000001',
      '00000004-0000-0000-0000-000000000002',
      '00000004-0000-0000-0000-000000000003',
      '00000004-0000-0000-0000-000000000004'
    ]
  }, {})
}
