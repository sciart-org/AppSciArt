import { query } from '../db.js'
import { insertTimestampedRow, uniqueSuffix } from './rows.js'
import { createFlowerFolders } from './driveTemplates.js'
import { ensureHackathonHasTeams, ensureSeedOfHackathon } from './consistency.js'

const DELIVERED_FLOWER_STATES = ['IN_REVIEW', 'PUBLISHED']

const assignMembers = async ({ hackathon, members, unitColumn, unitId, leader, leaderColumn }) => {
  for (const member of members) {
    const { rowCount } = await query(
      `UPDATE public.participations SET "${unitColumn}" = $1, "${leaderColumn}" = $2
       WHERE "userProfileId" = $3 AND "hackathonId" = $4`,
      [unitId, member.id === leader?.id, member.id, hackathon.id])
    if (rowCount === 0) throw new Error(`${member.email} is not enrolled in hackathon ${hackathon.id}`)
  }
}

export const aGroup = async ({ hackathon, seed, members = [], voice = members[0], map = null, delivered = false }) => {
  await ensureSeedOfHackathon(seed, hackathon)
  const group = await insertTimestampedRow('public.conceptual_maps', {
    seedId: seed.id,
    map: map === null ? null : JSON.stringify(map),
    isDelivered: delivered
  })
  await assignMembers({
    hackathon, members, unitColumn: 'groupId', unitId: group.id, leader: voice, leaderColumn: 'isGroupVoice'
  })
  return group
}

export const aTeam = async ({
  hackathon,
  seed,
  members = [],
  speaker = members[0],
  number = 1,
  flowerState = 'IN_BLANK',
  title = DELIVERED_FLOWER_STATES.includes(flowerState) ? `Flower ${uniqueSuffix()}` : null,
  concept = DELIVERED_FLOWER_STATES.includes(flowerState) ? 'A flower concept inspired by its seed' : null,
  mainImage = true
}) => {
  ensureHackathonHasTeams(hackathon)
  await ensureSeedOfHackathon(seed, hackathon)
  const flower = await insertTimestampedRow('public.flowers', {
    seedId: seed.id,
    state: flowerState,
    title,
    concept,
    driveLink: await createFlowerFolders({ hackathonDriveLink: hackathon.driveLink, teamNumber: number, seedTitle: seed.title, mainImage })
  })
  await assignMembers({
    hackathon, members, unitColumn: 'teamId', unitId: flower.id, leader: speaker, leaderColumn: 'isTeamSpeaker'
  })
  return flower
}
