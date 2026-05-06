'use strict'
/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface) {
  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_hackathons_phase" ADD VALUE 'TEAM_PRESENTATION' AFTER 'TEAM_WORK';
  `)
}

export async function down (queryInterface) {
  await queryInterface.sequelize.query(`
    ALTER TYPE "enum_hackathons_phase" RENAME TO "enum_hackathons_phase_old";
  `)
  await queryInterface.sequelize.query(`
    CREATE TYPE "enum_hackathons_phase" AS ENUM('PREPARING', 'GROUP_CREATION', 'GROUP_WORK', 'GROUP_PRESENTATION', 'TEAM_CREATION', 'TEAM_WORK');
  `)
  await queryInterface.sequelize.query(`
    ALTER TABLE hackathons ALTER COLUMN phase TYPE "enum_hackathons_phase" USING phase::text::"enum_hackathons_phase";
  `)
  await queryInterface.sequelize.query(`
    DROP TYPE "enum_hackathons_phase_old";
  `)
}
