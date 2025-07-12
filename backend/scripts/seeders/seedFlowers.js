import { Flower } from '../../src/models/Flower.js'

const baseFlower = {
  id: null,
  title: null,
  template: null,
  mainImage: 'https://i.imgur.com/fHZzvFR.png',
  conceptualMap: null,
  state: 'IN_BLANK',
  driveLink: null,
  seedId: null
}

export async function seedFlowers () {
  await Flower.bulkCreate([
    {
      ...baseFlower,
      id: '00000000-0000-0007-0000-000000000000',
      title: 'Crossing the veil flower 1',
      seedId: '00000000-0000-0005-0000-000000000000'
    },
    {
      ...baseFlower,
      id: '00000000-0000-0007-0000-000000000001',
      title: 'Crossing the veil flower 2',
      state: 'IN_PROGRESS',
      seedId: '00000000-0000-0005-0000-000000000000'
    },
    {
      ...baseFlower,
      id: '00000000-0000-0007-0000-000000000002',
      title: 'The thread of your fragments flower 1',
      state: 'IN_REVIEW',
      seedId: '00000000-0000-0005-0000-000000000001'
    },
    {
      ...baseFlower,
      id: '00000000-0000-0007-0000-000000000003',
      title: 'The thread of your fragments flower 2',
      seedId: '00000000-0000-0005-0000-000000000001'
    },
    {
      ...baseFlower,
      id: '00000000-0000-0007-0000-000000000004',
      title: 'Boya Kduino flower 1',
      state: 'PUBLISHED',
      seedId: '00000000-0000-0005-0000-000000000008'
    },
    {
      ...baseFlower,
      id: '00000000-0000-0007-0000-000000000005',
      title: 'Boya Kduino flower 2',
      state: 'PUBLISHED',
      seedId: '00000000-0000-0005-0000-000000000008'
    }
  ])
}
