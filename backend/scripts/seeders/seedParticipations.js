import { Op } from 'sequelize'
import { Participation } from '../../src/models/Participation.js'
import { UserProfile } from '../../src/models/UserProfile.js'

const baseParticipation = {
  id: null,
  clusterNumber: null,
  roles: null,
  interests: null,
  groupId: null,
  teamId: null,
  fruitId: null,
  userProfileId: null,
  hackathonId: null
}

export async function seedParticipations () {
  const participants = await UserProfile.findAll({
    where: {
      name: {
        [Op.iLike]: '%participant%'
      }
    }
  })

  await Participation.bulkCreate([
    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000000',
      roles: ['TECHNOLOGIST', 'SCIENTIST'],
      teamId: '00000000-0000-0007-0000-000000000000',
      userProfileId: participants[0].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000000'
    },
    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000001',
      roles: ['ARTIST', 'OTHERS'],
      teamId: '00000000-0000-0007-0000-000000000000',
      userProfileId: participants[1].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000000'
    },
    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000002',
      roles: ['SCIENTIST'],
      teamId: '00000000-0000-0007-0000-000000000000',
      userProfileId: participants[2].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000000'
    },

    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000003',
      clusterNumber: 0,
      roles: ['TECHNOLOGIST', 'SCIENTIST'],
      teamId: '00000000-0000-0007-0000-000000000001',
      userProfileId: participants[0].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000001'
    },
    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000004',
      clusterNumber: 0,
      roles: ['OTHERS'],
      teamId: '00000000-0000-0007-0000-000000000001',
      userProfileId: participants[4].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000001'
    },

    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000005',
      clusterNumber: 0,
      roles: ['OTHERS'],
      teamId: '00000000-0000-0007-0000-000000000002',
      userProfileId: participants[3].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000001'
    },
    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000006',
      clusterNumber: 0,
      roles: ['ARTIST'],
      teamId: '00000000-0000-0007-0000-000000000002',
      userProfileId: participants[5].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000001'
    },

    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000007',
      clusterNumber: 1,
      roles: ['ARTIST', 'OTHERS'],
      teamId: '00000000-0000-0007-0000-000000000003',
      userProfileId: participants[1].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000001'
    },
    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000008',
      clusterNumber: 1,
      roles: ['SCIENTIST'],
      teamId: '00000000-0000-0007-0000-000000000003',
      userProfileId: participants[2].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000001'
    },

    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000009',
      clusterNumber: 1,
      roles: ['SCIENTIST'],
      teamId: '00000000-0000-0007-0000-000000000004',
      fruitId: '00000000-0000-0008-0000-000000000001',
      userProfileId: participants[2].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000002'
    },
    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000010',
      clusterNumber: 1,
      roles: ['ARTIST'],
      teamId: '00000000-0000-0007-0000-000000000004',
      fruitId: '00000000-0000-0008-0000-000000000000',
      userProfileId: participants[5].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000002'
    },

    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000011',
      clusterNumber: 0,
      roles: ['TECHNOLOGIST', 'SCIENTIST'],
      teamId: '00000000-0000-0007-0000-000000000005',
      fruitId: '00000000-0000-0008-0000-000000000002',
      userProfileId: participants[0].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000002'
    },
    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000012',
      clusterNumber: 0,
      roles: ['OTHERS'],
      teamId: '00000000-0000-0007-0000-000000000005',
      fruitId: '00000000-0000-0008-0000-000000000003',
      userProfileId: participants[3].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000002'
    },
    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000013',
      clusterNumber: 0,
      roles: ['OTHERS'],
      teamId: '00000000-0000-0007-0000-000000000005',
      userProfileId: participants[4].toJSON().id,
      hackathonId: '00000000-0000-0006-0000-000000000002'
    }
  ])
}
