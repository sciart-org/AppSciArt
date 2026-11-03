'use strict'

import { EDITION, SCIENTIST, SEEDS } from '../sampleData.js'
import { PROFILES_TABLE } from '../factories/accounts.js'
import { deleteDriveFolderOf, driveService } from '../factories/drive.js'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  const { createDriveEdition, createDriveSeed } = await driveService()
  const { driveLink: editionDriveLink } = await createDriveEdition(EDITION.year, EDITION.name)
  await queryInterface.bulkInsert('editions', [{ ...EDITION, driveLink: editionDriveLink }])

  const seeds = await Promise.all(SEEDS.map(async seed => ({
    ...seed,
    driveLink: await createDriveSeed(editionDriveLink, seed.title)
  })))
  await queryInterface.bulkInsert('seeds', seeds)
  await queryInterface.bulkInsert('seed_editions', SEEDS.map(seed => ({ seedId: seed.id, editionId: EDITION.id })))

  await queryInterface.bulkInsert(PROFILES_TABLE, [SCIENTIST])
  await queryInterface.bulkInsert('scientist_editions', [{ editionId: EDITION.id, userProfileId: SCIENTIST.id }])
  await queryInterface.bulkInsert('seed_scientists', SEEDS.map(seed => ({ seedId: seed.id, userProfileId: SCIENTIST.id })))
}

export async function down (queryInterface, Sequelize) {
  await deleteDriveFolderOf(queryInterface, 'editions', EDITION.id)
  await queryInterface.bulkDelete('seeds', { id: SEEDS.map(seed => seed.id) })
  await queryInterface.bulkDelete('editions', { id: EDITION.id })
  await queryInterface.bulkDelete(PROFILES_TABLE, { id: SCIENTIST.id })
}
