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
      title: 'Crossing the veil',
      state: 'PUBLISHED',
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
      seedId: '00000000-0000-0005-0000-000000000008',
      concept: `From data comes knowledge, and from knowledge, a new way to view nature. However, to reach this new perspective, one must embark on a journey. The metaphorical journey we propose involves movement through space, walking, integrating—transforming noise, disorder, and the digital into new discoveries about reality.

Participants are invited to embark on a metaphorical journey starting with chaotic digital images, sounds, and technical word clouds—all sourced from the Minka platform. Using motion sensors to detect progress, this movement restructures the chaos. Disjointed images organize themselves, discordant sounds harmonize into music, and step by step, participants reveal a concrete, intimate, and artistic vision of nature. It unveils the hidden shapes of data, traveling metaphorically to the other side: knowledge and, ultimately, reality.

The project features four distinct journeys:
  · Air-inspired world of birds
  · Subaquatic realms
  · The microscopic universe of small amphibians or insects
  · The kingdom of plants

These fantastical creations will be beautiful, recognizable, and otherworldly.`
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
