'use strict'

import { randomUUID } from 'crypto'
import { EVALUATORS, ONGOING_HACKATHON, PARTICIPANTS } from '../sampleData.js'
import { profileIdsByEmail } from '../factories/accounts.js'

const EVALUATORS_TABLE = { tableName: 'evaluators', schema: 'profiles' }

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  const profileIds = await profileIdsByEmail(queryInterface, [...EVALUATORS, ...PARTICIPANTS].map(user => user.email))

  await queryInterface.bulkInsert(EVALUATORS_TABLE, EVALUATORS.map(evaluator => ({
    id: randomUUID(),
    userProfileId: profileIds[evaluator.email],
    hackathonId: ONGOING_HACKATHON.id
  })))

  await queryInterface.bulkInsert('participations', PARTICIPANTS.map(participant => ({
    id: randomUUID(),
    roles: participant.roles,
    interests: participant.interests,
    hasConfirmedAssistance: false,
    userProfileId: profileIds[participant.email],
    hackathonId: ONGOING_HACKATHON.id
  })))
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('participations', { hackathonId: ONGOING_HACKATHON.id })
  await queryInterface.bulkDelete(EVALUATORS_TABLE, { hackathonId: ONGOING_HACKATHON.id })
}
