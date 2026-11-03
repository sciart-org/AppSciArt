const SAMPLE_DATA_ENVS = ['development', 'pre-production']

if (!SAMPLE_DATA_ENVS.includes(process.env.NODE_ENV)) {
  throw new Error(`Sample data only runs in ${SAMPLE_DATA_ENVS.join(' or ')}, not in "${process.env.NODE_ENV}"`)
}

const MS_PER_HOUR = 60 * 60 * 1000
const hoursFromNow = (hours) => new Date(Date.now() + hours * MS_PER_HOUR)

const ROLE_TABLES = {
  FACILITATOR: { tableName: 'facilitators', schema: 'profiles' }
}

const SAMPLE_EMAIL_DOMAIN = 'appsciart.test'
const sampleEmail = (handle) => `${handle}@${SAMPLE_EMAIL_DOMAIN}`

export const FACILITATOR = {
  email: sampleEmail('facilitator'),
  name: 'Lucía',
  surname: 'Romero',
  gender: 'FEMALE',
  ageRange: '35_44',
  roleTable: ROLE_TABLES.FACILITATOR
}

export const EVALUATORS = [
  { email: sampleEmail('evaluator1'), name: 'Javier', surname: 'Ortega', gender: 'MALE', ageRange: '45_54' },
  { email: sampleEmail('evaluator2'), name: 'Marta', surname: 'Gil', gender: 'FEMALE', ageRange: '35_44' }
]

export const PARTICIPANTS = [
  { email: sampleEmail('participant1'), name: 'Ana', surname: 'Torres', gender: 'FEMALE', ageRange: '25_34', roles: ['ARTIST'], interests: 'Generative art and data visualisation.' },
  { email: sampleEmail('participant2'), name: 'Pablo', surname: 'Ruiz', gender: 'MALE', ageRange: '18_24', roles: ['SCIENTIST'], interests: 'Molecular biology and science outreach.' },
  { email: sampleEmail('participant3'), name: 'Elena', surname: 'Navarro', gender: 'FEMALE', ageRange: '25_34', roles: ['TECHNOLOGIST'], interests: 'Interactive installations and sensors.' },
  { email: sampleEmail('participant4'), name: 'Daniel', surname: 'Castro', gender: 'MALE', ageRange: '35_44', roles: ['ARTIST', 'TECHNOLOGIST'], interests: 'Sound art and creative coding.' },
  { email: sampleEmail('participant5'), name: 'Irene', surname: 'Molina', gender: 'FEMALE', ageRange: '25_34', roles: ['SCIENTIST'], interests: 'Genomics and bioethics.' },
  { email: sampleEmail('participant6'), name: 'Sergio', surname: 'Delgado', gender: 'MALE', ageRange: '25_34', roles: ['ARTIST'], interests: 'Illustration and scientific drawing.' },
  { email: sampleEmail('participant7'), name: 'Carmen', surname: 'Vega', gender: 'FEMALE', ageRange: '45_54', roles: ['OTHER'], interests: 'Cultural management and museum education.' },
  { email: sampleEmail('participant8'), name: 'Hugo', surname: 'Serrano', gender: 'OTHER', ageRange: '18_24', roles: ['TECHNOLOGIST'], interests: 'Machine learning applied to health data.' }
]

export const ACCOUNTS = [FACILITATOR, ...EVALUATORS, ...PARTICIPANTS]

export const SCIENTIST = {
  id: 'd0000003-0000-0000-0000-000000000001',
  email: sampleEmail('guillermo.antinolo'),
  name: 'Guillermo',
  surname: 'Antiñolo'
}

export const EDITION = {
  id: 'd0000000-0000-0000-0000-000000000001',
  name: 'ASTER+S > GENETICS',
  year: 2026,
  catalogLink: null,
  shortDescription: 'Focusing on genetics and molecular biology, this edition brings together artists and scientists to co-create projects exploring life sciences concepts and ethical dimensions.',
  state: 'ACTIVE'
}

export const SEEDS = [
  {
    id: 'd0000001-0000-0000-0000-000000000001',
    title: 'Del Gen al Paciente: cartografías de la decisión clínica',
    state: 'PUBLISHED',
    branchesOfKnowledge: ['Medicine', 'Genomics', 'Bio-informatics'],
    seedPDF: 'https://drive.google.com/file/d/1xS9fZ5Iufu4ThBzbsFUbktrXXQ9ZLTME/preview?usp=sharing',
    presentationLink: 'https://docs.google.com/presentation/d/1gBwZyJiNeMVhF-WO7BQ3_rPdOZQzilhx/preview?usp=sharing&ouid=112485687551038534612&rtpof=true&sd=true'
  },
  {
    id: 'd0000001-0000-0000-0000-000000000002',
    title: 'Datos que curan: Cartografías de Big Data en Medicina de Precisión',
    state: 'PUBLISHED',
    branchesOfKnowledge: ['Medicine', 'Biomedical Informatics', 'Bio-informatics'],
    seedPDF: 'https://drive.google.com/file/d/1qtbqE3qL_g0P5UzRjtlaIUxHNel5v_X0/preview?usp=sharing',
    presentationLink: 'https://docs.google.com/presentation/d/1XINYSF49ow4dBWA6e_u13ipnVstD6qV2/preview?usp=sharing&ouid=112485687551038534612&rtpof=true&sd=true'
  },
  {
    id: 'd0000001-0000-0000-0000-000000000003',
    title: 'Genes bajo sospecha: genética, cáncer y medicina personalizada',
    state: 'PUBLISHED',
    branchesOfKnowledge: ['Medicine', 'Genetics', 'Oncology', 'Epidemiology'],
    seedPDF: 'https://drive.google.com/file/d/1TTy3pdlAGRN99v-N_pQSlYCxn9eoxmG0/preview?usp=sharing',
    presentationLink: 'https://docs.google.com/presentation/d/1iqW18svL2ZWqyptYnld3pzQqLVN_mM8f/preview?usp=sharing&ouid=112485687551038534612&rtpof=true&sd=true'
  },
  {
    id: 'd0000001-0000-0000-0000-000000000004',
    title: 'CRISPR: Editar lo vivo: terapias génicas entre precisión y responsabilidad',
    state: 'PUBLISHED',
    branchesOfKnowledge: ['Medicine', 'Genomics', 'Bio-informatics'],
    seedPDF: 'https://drive.google.com/file/d/1j698-rIjEXdwHAumwxAkiXcRDH9oVOzL/preview?usp=sharing',
    presentationLink: 'https://docs.google.com/presentation/d/1rVO_b-WCAsgS1iLcpvh_7cg_HnXlf9Mn/preview?usp=sharing&ouid=112485687551038534612&rtpof=true&sd=true'
  }
]

export const ONGOING_HACKATHON = {
  id: 'd0000002-0000-0000-0000-000000000001',
  internalName: 'ASTER+S > GENETICS - HYBRID SEVILLA HACKATHON',
  isPrivate: false,
  startDate: hoursFromNow(-1),
  endDate: hoursFromNow(48),
  type: 'HYBRID',
  location: 'Escuela Técnica Superior de Ingeniería Informática, Av. de la Reina Mercedes, s/n, 41012 Sevilla',
  description: 'Hybrid hackathon in Sevilla for the ASTER+S Genetics edition.',
  state: 'CLOSED',
  phase: 'PREPARING',
  meetLink: 'https://meet.google.com/abc-defg-hij',
  editionId: EDITION.id
}

export const ONGOING_HACKATHON_SECTIONS = [
  { sectionName: '1st day of hackathon', text: 'Meet the participants + Develop a common understanding of the "SciArt Seeds" + Create interdisciplinary teams.' },
  { sectionName: '2nd day of hackathon', text: 'Brainstorming to develop the artistic concept and create the SciArt proposal, which we call "SciArt Flowers."' },
  { sectionName: '3rd day of hackathon', text: 'Presentation of the "SciArt Flowers" projects as 3-minute videos.' }
]
