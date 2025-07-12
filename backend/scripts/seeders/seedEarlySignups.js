import { EarlySignup } from '../../src/models/EarlySignup.js'

export async function seedEarlySignups () {
  await EarlySignup.bulkCreate([
    {
      id: '00000000-0000-0004-0000-000000000000',
      email: 'participant3@gmail.com',
      isProvider: false
    },
    {
      id: '00000000-0000-0004-0000-000000000001',
      email: 'participant4@gmail.com',
      isProvider: true
    }
  ])
}
