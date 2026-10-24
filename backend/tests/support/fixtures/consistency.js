import { query } from '../db.js'

const HACKATHON_STATES_BY_EDITION_STATE = {
  PLANNED: ['PLANNED'],
  ACTIVE: ['PLANNED', 'OPEN', 'CLOSED', 'FINISHED'],
  CLOSED: ['FINISHED'],
  PUBLISHED: ['FINISHED']
}

const TEAM_PHASES = ['TEAM_CREATION', 'TEAM_WORK', 'TEAM_PRESENTATION']

const ensure = (condition, message) => {
  if (!condition) throw new Error(`Unreachable state: ${message}`)
}

const isEnded = (hackathon) => hackathon.state === 'FINISHED'

const isInTeamPhase = (hackathon) => hackathon.state === 'CLOSED' && TEAM_PHASES.includes(hackathon.phase)

const isSeedOfEdition = async (seed, editionId) => {
  const { rowCount } = await query(
    'SELECT 1 FROM public.seed_editions WHERE "seedId" = $1 AND "editionId" = $2', [seed.id, editionId])
  return rowCount > 0
}

const isSeedOfHackathon = async (seed, hackathon) => {
  const { rowCount } = await query(
    'SELECT 1 FROM public.hackathon_seeds WHERE "seedId" = $1 AND "hackathonId" = $2', [seed.id, hackathon.id])
  return rowCount > 0
}

export const ensureHackathonFitsEdition = (hackathonState, edition) => ensure(
  HACKATHON_STATES_BY_EDITION_STATE[edition.state].includes(hackathonState),
  `a ${edition.state} edition can't have a ${hackathonState} hackathon`)

export const ensureSeedFitsHackathon = async (seed, hackathon) => {
  ensure(seed.state === 'PUBLISHED', `a hackathon's seeds must be published, got ${seed.state}`)
  ensure(await isSeedOfEdition(seed, hackathon.editionId), "a hackathon's seeds must belong to its edition")
}

export const ensureHackathonHasTeams = (hackathon) => ensure(
  isInTeamPhase(hackathon) || isEnded(hackathon),
  `flowers exist only in team phases or ended hackathons, got ${hackathon.state} / ${hackathon.phase}`)

export const ensureHackathonHasFruits = (hackathon) => ensure(
  isEnded(hackathon), `fruits exist only for ended hackathons, got ${hackathon.state}`)

export const ensureSameEdition = (hackathon, edition) => ensure(
  hackathon.editionId === edition.id, 'the hackathon belongs to another edition')

export const ensureSeedOfHackathon = async (seed, hackathon) => ensure(
  await isSeedOfHackathon(seed, hackathon), "groups and teams only use their hackathon's seeds")
