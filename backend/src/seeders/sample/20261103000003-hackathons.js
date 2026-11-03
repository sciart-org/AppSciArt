'use strict'

import { randomUUID } from 'crypto'
import { EDITION, ONGOING_HACKATHON, ONGOING_HACKATHON_SECTIONS, SEEDS } from '../sampleData.js'
import { deleteDriveFolderOf, driveLinkOf, driveService } from '../factories/drive.js'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  const { createDriveHackathon } = await driveService()
  const editionDriveLink = await driveLinkOf(queryInterface, 'editions', EDITION.id)
  const driveLink = await createDriveHackathon(editionDriveLink, ONGOING_HACKATHON.internalName)
  await queryInterface.bulkInsert('hackathons', [{ ...ONGOING_HACKATHON, driveLink }])

  await queryInterface.bulkInsert('hackathon_descriptions', ONGOING_HACKATHON_SECTIONS.map((section, position) => ({
    id: randomUUID(),
    ...section,
    position,
    hackathonId: ONGOING_HACKATHON.id
  })))
  await queryInterface.bulkInsert('hackathon_seeds', SEEDS.map(seed => ({ seedId: seed.id, hackathonId: ONGOING_HACKATHON.id })))
}

export async function down (queryInterface, Sequelize) {
  await deleteDriveFolderOf(queryInterface, 'hackathons', ONGOING_HACKATHON.id)
  await queryInterface.bulkDelete('hackathons', { id: ONGOING_HACKATHON.id })
}
