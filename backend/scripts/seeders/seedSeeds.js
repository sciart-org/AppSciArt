import { SeedEditions } from '../../src/models/intermediate/SeedEditions.js'
import { SeedLikes } from '../../src/models/intermediate/SeedLikes.js'
import { Seed } from '../../src/models/Seed.js'
import { UserProfile } from '../../src/models/UserProfile.js'
import { SeedScientists } from '../../src/models/intermediate/SeedScientists.js'
import { InspiringScientist } from '../../src/models/roles/InspiringScientist.js'

const baseSeed = {
  id: null,
  title: null,
  template: null,
  mainImage: 'https://i.imgur.com/rEFpydA.png',
  state: 'IN_BLANK',
  branchesOfKnowledge: null,
  seedPDF: null,
  videoLink: null,
  presentationLink: null,
  podcastLink: null,
  driveLink: null
}

export async function seedSeeds () {
  await Seed.bulkCreate([
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000000',
      title: 'Crossing the veil',
      mainImage: 'https://i.imgur.com/FCYpbTO.png',
      state: 'PUBLISHED',
      branchesOfKnowledge: ['Neuroscience', 'Neurosurgery', 'Intensive care', 'Neurocritical']
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000001',
      title: 'The thread of your fragments',
      mainImage: 'https://i.imgur.com/KSTWzAY.png',
      state: 'PUBLISHED',
      branchesOfKnowledge: ['Neurology', 'Memory', 'Dementia']
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000002',
      title: 'Dancing in the Night',
      mainImage: 'https://i.imgur.com/kOy9hjY.png',
      state: 'IN_REVIEW',
      branchesOfKnowledge: ['Medicine', 'Clinical neurophysiology']
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000003',
      title: 'Night Terrors',
      mainImage: 'https://i.imgur.com/60uyAkU.png',
      state: 'IN_REVIEW',
      branchesOfKnowledge: ['Medicine', 'Clinical neurophysiology']
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000004',
      title: 'The essence of being',
      mainImage: 'https://i.imgur.com/QO3BRWX.png',
      state: 'IN_PROGRESS',
      branchesOfKnowledge: ['Neuroscience', 'Neurobehaviour']
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000005',
      title: 'A Prisoner Brain',
      mainImage: 'https://i.imgur.com/9K7mXxa.png',
      state: 'IN_PROGRESS',
      branchesOfKnowledge: ['Neuroscience', 'Neurosurgery', 'Hydrocephalus', 'Cranial expansion']
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000006',
      title: 'Meta-ASTER',
      mainImage: 'https://i.imgur.com/L76NDu9.png',
      branchesOfKnowledge: ['Neuroscience', 'Neuroart', 'Neuroaesthetics']
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000007',
      title: 'Yaku Sumaq',
      mainImage: 'https://i.imgur.com/LCZLnah.png',
      branchesOfKnowledge: ['Environmental monitoring', 'Citizen science']
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000008',
      title: 'Boya Kduino',
      mainImage: 'https://i.imgur.com/06X8MwI.jpeg',
      state: 'PUBLISHED',
      branchesOfKnowledge: ['Physics', 'Optics']
    }
  ])

  await SeedEditions.bulkCreate([
    {
      seedId: '00000000-0000-0005-0000-000000000000',
      editionId: '00000000-0000-0003-0000-000000000002'
    },
    {
      seedId: '00000000-0000-0005-0000-000000000001',
      editionId: '00000000-0000-0003-0000-000000000002'
    },
    {
      seedId: '00000000-0000-0005-0000-000000000002',
      editionId: '00000000-0000-0003-0000-000000000002'
    },
    {
      seedId: '00000000-0000-0005-0000-000000000003',
      editionId: '00000000-0000-0003-0000-000000000002'
    },
    {
      seedId: '00000000-0000-0005-0000-000000000004',
      editionId: '00000000-0000-0003-0000-000000000002'
    },
    {
      seedId: '00000000-0000-0005-0000-000000000005',
      editionId: '00000000-0000-0003-0000-000000000002'
    },
    {
      seedId: '00000000-0000-0005-0000-000000000006',
      editionId: '00000000-0000-0003-0000-000000000002'
    },
    {
      seedId: '00000000-0000-0005-0000-000000000007',
      editionId: '00000000-0000-0003-0000-000000000001'
    },
    {
      seedId: '00000000-0000-0005-0000-000000000008',
      editionId: '00000000-0000-0003-0000-000000000000'
    }
  ])

  const user1 = await UserProfile.findOne({
    where: {
      email: 'participant1@gmail.com'
    }
  })

  const user2 = await UserProfile.findOne({
    where: {
      email: 'participant2@gmail.com'
    }
  })

  await SeedLikes.bulkCreate([
    {
      seedId: '00000000-0000-0005-0000-000000000000',
      userProfileId: user1?.id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000001',
      userProfileId: user1?.id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000001',
      userProfileId: user2?.id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000008',
      userProfileId: user2?.id
    }
  ])

  const scientists = await InspiringScientist.findAll()

  await SeedScientists.bulkCreate([
    {
      seedId: '00000000-0000-0005-0000-000000000000',
      inspiringScientistId: scientists[1].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000001',
      inspiringScientistId: scientists[0].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000001',
      inspiringScientistId: scientists[2].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000002',
      inspiringScientistId: scientists[3].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000003',
      inspiringScientistId: scientists[1].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000003',
      inspiringScientistId: scientists[3].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000004',
      inspiringScientistId: scientists[0].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000004',
      inspiringScientistId: scientists[1].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000004',
      inspiringScientistId: scientists[3].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000005',
      inspiringScientistId: scientists[2].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000006',
      inspiringScientistId: scientists[0].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000006',
      inspiringScientistId: scientists[2].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000006',
      inspiringScientistId: scientists[3].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000007',
      inspiringScientistId: scientists[1].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000007',
      inspiringScientistId: scientists[2].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000007',
      inspiringScientistId: scientists[3].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000007',
      inspiringScientistId: scientists[0].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000008',
      inspiringScientistId: scientists[0].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000008',
      inspiringScientistId: scientists[3].id
    }
  ])
}
