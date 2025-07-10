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
    }
  ]

  for (const u of users) {
    try {
      await directRegister(u)
    } catch (err) {
      console.error(err)
    }
  }
}
