import { Edition } from '../../src/models/Edition.js'

const baseEdition = {
  id: null,
  name: null,
  logo: null,
  year: null,
  shortDescription: null,
  longDescription: null,
  catalogLink: null,
  isVisible: false
}

export async function seedEditions () {
  await Edition.bulkCreate([
    {
      ...baseEdition,
      id: '00000000-0000-0003-0000-000000000000',
      name: 'ASTER+S > ART ^ ENVIRONMENT & AI',
      logo: 'https://i.imgur.com/dWnJwoO.png',
      year: 2023,
      isVisible: true
    },
    {
      ...baseEdition,
      id: '00000000-0000-0003-0000-000000000001',
      name: 'ASTER+S > ART ^ SEALIFE',
      logo: 'https://i.imgur.com/Onq8x7S.png',
      year: 2024,
      shortDescription: `In collaboration with the Institute of Marine Sciences (CSIC, Barcelona)

How can citizens contribute to better understanding and caring for our marine ecosystems affected by the Anthropocene?

Find it in this edition`,
      longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      isVisible: true
    },
    {
      ...baseEdition,
      id: '00000000-0000-0003-0000-000000000002',
      name: 'ASTER+S > ART ^ NEUROSCIENCE',
      logo: 'https://i.imgur.com/WifKQ6t.png',
      year: 2026,
      shortDescription: `In collaboration with the Institute of Marine Sciences (CSIC, Barcelona)

How can citizens contribute to better understanding and caring for our marine ecosystems affected by the Anthropocene?

Find it in this edition`,
      longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      isVisible: true
    }
  ])
}
