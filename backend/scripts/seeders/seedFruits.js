import { Fruit } from '../../src/models/Fruit.js'

const baseFruit = {
  id: null,
  title: null,
  mainImage: 'https://i.imgur.com/e43XwwH.png',
  state: 'IN_BLANK',
  authorVision: null,
  curatorVision: null,
  driveLink: null,
  flowerId: null
}

export async function seedFruits () {
  await Fruit.bulkCreate([
    {
      ...baseFruit,
      id: '00000000-0000-0008-0000-000000000000',
      title: 'Boya Kduino fruit 1-1',
      flowerId: '00000000-0000-0007-0000-000000000004'
    },
    {
      ...baseFruit,
      id: '00000000-0000-0008-0000-000000000001',
      title: 'Boya Kduino fruit 1-2',
      state: 'IN_PROGRESS',
      flowerId: '00000000-0000-0007-0000-000000000004'
    },
    {
      ...baseFruit,
      id: '00000000-0000-0008-0000-000000000002',
      title: 'Boya Kduino fruit 2-1',
      state: 'IN_REVIEW',
      flowerId: '00000000-0000-0007-0000-000000000005'
    },
    {
      ...baseFruit,
      id: '00000000-0000-0008-0000-000000000003',
      title: 'Boya Kduino fruit 2-2',
      state: 'PUBLISHED',
      flowerId: '00000000-0000-0007-0000-000000000005'
    }
  ])
}
