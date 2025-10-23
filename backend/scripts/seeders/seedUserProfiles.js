import { Administrator } from '../../src/models/roles/Administrator.js'
import { Designer } from '../../src/models/roles/Designer.js'
import { Evaluator } from '../../src/models/roles/Evaluator.js'
import { Facilitator } from '../../src/models/roles/Facilitator.js'
import { UserProfile } from '../../src/models/UserProfile.js'
import { directRegister } from '../../src/services/authService.js'

const baseUser = {
  email: null,
  password: null,
  name: null,
  surname: null,
  gender: null,
  birthDate: null,
  affiliations: null,
  areasOfInterest: null,
  about: null,
  tags: null,
  socialNetworks: null,
  sites: null
}

export async function seedUserProfiles () {
  const users = [
    {
      ...baseUser,
      email: 'participant1@gmail.com',
      password: 'participant',
      name: 'participant',
      surname: '1'
    },
    {
      ...baseUser,
      email: 'participant2@gmail.com',
      password: 'participant',
      name: 'participant',
      surname: '2'
    },
    {
      ...baseUser,
      email: 'participant3@gmail.com',
      password: 'participant',
      name: 'participant',
      surname: '3'
    },
    {
      ...baseUser,
      email: 'participant4@gmail.com',
      password: 'participant',
      name: 'participant',
      surname: '4'
    },
    {
      ...baseUser,
      email: 'participant5@gmail.com',
      password: 'participant',
      name: 'participant',
      surname: '5'
    },
    {
      ...baseUser,
      email: 'participant6@gmail.com',
      password: 'participant',
      name: 'participant',
      surname: '6'
    },
    {
      ...baseUser,
      email: 'administrator1@gmail.com',
      password: 'administrator',
      name: 'administrator',
      surname: '1'
    },
    {
      ...baseUser,
      email: 'administrator2@gmail.com',
      password: 'administrator',
      name: 'administrator',
      surname: '2'
    },
    {
      ...baseUser,
      email: 'designer1@gmail.com',
      password: 'designer',
      name: 'designer',
      surname: '1'
    },
    {
      ...baseUser,
      email: 'designer2@gmail.com',
      password: 'designer',
      name: 'designer',
      surname: '2'
    },
    {
      ...baseUser,
      email: 'evaluator1@gmail.com',
      password: 'evaluator',
      name: 'evaluator',
      surname: '1'
    },
    {
      ...baseUser,
      email: 'evaluator2@gmail.com',
      password: 'evaluator',
      name: 'evaluator',
      surname: '2'
    },
    {
      ...baseUser,
      email: 'facilitator1@gmail.com',
      password: 'facilitator',
      name: 'facilitator',
      surname: '1'
    },
    {
      ...baseUser,
      email: 'facilitator2@gmail.com',
      password: 'facilitator',
      name: 'facilitator',
      surname: '2'
    },
    {
      ...baseUser,
      email: 'scientist1@gmail.com',
      password: 'scientist',
      name: 'scientist',
      surname: '1'
    },
    {
      ...baseUser,
      email: 'scientist2@gmail.com',
      password: 'scientist',
      name: 'scientist',
      surname: '2'
    },
    {
      ...baseUser,
      email: 'scientist3@gmail.com',
      password: 'scientist',
      name: 'scientist',
      surname: '3'
    },
    {
      ...baseUser,
      email: 'scientist4@gmail.com',
      password: 'scientist',
      name: 'scientist',
      surname: '4'
    }
  ]

  for (const u of users) {
    try {
      await directRegister(u)
      const user = await UserProfile.findOne({
        where: {
          email: u.email
        }
      })
      const body = { userProfileId: user.id }
      if (u.name.includes('administrator')) {
        await Administrator.create(body)
      }
      if (u.name.includes('designer')) {
        await Designer.create(body)
      }
      if (u.name.includes('evaluator')) {
        await Evaluator.create(body)
      }
      if (u.name.includes('facilitator')) {
        await Facilitator.create(body)
      }
    } catch (err) {
      console.error(err)
    }
  }
}
