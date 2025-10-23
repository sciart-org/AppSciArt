import { SeedEditions } from '../../src/models/intermediate/SeedEditions.js'
import { SeedLikes } from '../../src/models/intermediate/SeedLikes.js'
import { Seed } from '../../src/models/Seed.js'
import { UserProfile } from '../../src/models/UserProfile.js'
import { SeedScientists } from '../../src/models/intermediate/SeedScientists.js'
import { Op } from 'sequelize'

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
      mainImage: 'https://drive.google.com/thumbnail?id=1cl894rG3qdWUzLoLoT0q1NGOZqZAeYGc&sz=s4000',
      state: 'PUBLISHED',
      branchesOfKnowledge: ['Neuroscience', 'Neurosurgery', 'Intensive care', 'Neurocritical'],
      seedPDF: 'https://drive.google.com/file/d/1xru7HNFyR311XO4RrOQFFcL-YELspapU/preview',
      videoLink: 'https://www.youtube.com/watch?v=MiWCkslG5Y0'
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000001',
      title: 'The thread of your fragments',
      mainImage: 'https://drive.google.com/thumbnail?id=13XytE_fyQYIJwjND8rJ7xM_7kq3UsvXp&sz=s4000',
      state: 'PUBLISHED',
      branchesOfKnowledge: ['Neurology', 'Memory', 'Dementia'],
      seedPDF: 'https://drive.google.com/file/d/1XOJx5gviajpPCH66mqZmUqNocXcXiTp6/preview',
      videoLink: 'https://www.youtube.com/watch?v=KyQUBukwwO8'
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000002',
      title: 'Dancing in the Night',
      mainImage: 'https://drive.google.com/thumbnail?id=18AMqnt5JjizSgqHNgU5Gz-WZcofgLYoD&sz=s4000',
      state: 'IN_REVIEW',
      branchesOfKnowledge: ['Medicine', 'Clinical neurophysiology'],
      seedPDF: 'https://drive.google.com/file/d/1J6J0weEukUfVtCvqZNGhieq17RQvJllP/preview'
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000003',
      title: 'Night Terrors',
      mainImage: 'https://drive.google.com/thumbnail?id=1GF0_c94PZYDZmVHWoaLaas6YgGm_KdKe&sz=s4000',
      state: 'IN_REVIEW',
      branchesOfKnowledge: ['Medicine', 'Clinical neurophysiology'],
      seedPDF: 'https://drive.google.com/file/d/10OALZmdY_SP3U_tltS7o6AXFhrFZOdJD/preview',
      videoLink: 'https://www.youtube.com/watch?v=YFMqF26UTy4'
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000004',
      title: 'The essence of being',
      mainImage: 'https://drive.google.com/thumbnail?id=1JSSlGQ7gRb42pUycfOFvHwvsIdnorHq_&sz=s4000',
      state: 'IN_PROGRESS',
      branchesOfKnowledge: ['Neuroscience', 'Neurobehaviour'],
      seedPDF: 'https://drive.google.com/file/d/1xw4pi74QBE4L7zcluhSgr2BQGT_OH9np/preview',
      videoLink: 'https://www.youtube.com/watch?v=7szAAF36cMo'
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000005',
      title: 'A Prisoner Brain',
      mainImage: 'https://drive.google.com/thumbnail?id=1ueyxNqfxirOB3qDdtDRtFSZs80aL_OUM&sz=s4000',
      state: 'IN_PROGRESS',
      branchesOfKnowledge: ['Neuroscience', 'Neurosurgery', 'Hydrocephalus', 'Cranial expansion'],
      seedPDF: 'https://drive.google.com/file/d/1hdqQWI1kCNJv9LMq0NegAQJAi21jZoMC/preview',
      videoLink: 'https://www.youtube.com/watch?v=ZSV1LauJlYk'
    },
    {
      ...baseSeed,
      id: '00000000-0000-0005-0000-000000000006',
      title: 'Meta-ASTER',
      mainImage: 'https://drive.google.com/thumbnail?id=1qmAlLiz2MNxbPJgOSfg3kzyWKTYGeJ5J&sz=s4000',
      branchesOfKnowledge: ['Neuroscience', 'Neuroart', 'Neuroaesthetics'],
      seedPDF: 'https://drive.google.com/file/d/1-IrowQLctUi4UGx6JA8fgzpcQJlKAPv0/preview'
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
      branchesOfKnowledge: ['Physics', 'Optics'],
      seedPDF: 'https://drive.google.com/file/d/1I_cUc7BXz4QzzwJsDGSKnAWbgtwGSJ4m/preview',
      videoLink: 'https://www.youtube.com/watch?app=desktop&v=_CJqDcOT068'
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

  const scientists = await UserProfile.findAll({
    where: {
      name: {
        [Op.iLike]: '%scientist%'
      }
    }
  })

  await SeedScientists.bulkCreate([
    {
      seedId: '00000000-0000-0005-0000-000000000000',
      userProfileId: scientists[1].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000001',
      userProfileId: scientists[0].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000001',
      userProfileId: scientists[2].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000002',
      userProfileId: scientists[3].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000003',
      userProfileId: scientists[1].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000003',
      userProfileId: scientists[3].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000004',
      userProfileId: scientists[0].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000004',
      userProfileId: scientists[1].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000004',
      userProfileId: scientists[3].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000005',
      userProfileId: scientists[2].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000006',
      userProfileId: scientists[0].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000006',
      userProfileId: scientists[2].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000006',
      userProfileId: scientists[3].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000007',
      userProfileId: scientists[1].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000007',
      userProfileId: scientists[2].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000007',
      userProfileId: scientists[3].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000007',
      userProfileId: scientists[0].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000008',
      userProfileId: scientists[0].id
    },
    {
      seedId: '00000000-0000-0005-0000-000000000008',
      userProfileId: scientists[3].id
    }
  ])
}
