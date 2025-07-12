import { Participation } from '../../src/models/Participation.js'
import { UserProfile } from '../../src/models/UserProfile.js'

const baseParticipation = {
  id: null,
  clusterNumber: null,
  roles: null,
  interests: null,
  flowerId: null,
  fruitId: null,
  userProfileId: null,
  hackathonId: null
}

export async function seedParticipations () {
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

  await Participation.bulkCreate([
    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000000',
      clusterNumber: 1,
      roles: ['ARTIST', 'SCIENTIST'],
      flowerId: '00000000-0000-0007-0000-000000000004',
      fruitId: '00000000-0000-0008-0000-000000000000',
      userProfileId: user1?.id,
      hackathonId: '00000000-0000-0006-0000-000000000002'
    },
    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000001',
      clusterNumber: 2,
      roles: ['TECHNOLOGIST', 'SCIENTIST'],
      flowerId: '00000000-0000-0007-0000-000000000005',
      fruitId: '00000000-0000-0008-0000-000000000002',
      userProfileId: user2?.id,
      hackathonId: '00000000-0000-0006-0000-000000000002'
    },
    {
      ...baseParticipation,
      id: '00000000-0000-0009-0000-000000000002',
      roles: ['TECHNOLOGIST', 'OTHERS'],
      userProfileId: user1?.id,
      hackathonId: '00000000-0000-0006-0000-000000000000'
    }
  ])
}
