import { randomUUID } from 'crypto'
import { daysFromNow, insertRow, insertTimestampedRow, linkRows, uniqueSuffix } from './rows.js'
import { createHackathonFolders } from './driveTemplates.js'
import { anAnnouncedEdition } from './editions.js'
import { ensureHackathonFitsEdition, ensureSeedFitsHackathon } from './consistency.js'

const DATES_BY_STATE = {
  PLANNED: { startDate: daysFromNow(30), endDate: daysFromNow(31) },
  OPEN: { startDate: daysFromNow(30), endDate: daysFromNow(31) },
  CLOSED: { startDate: daysFromNow(-0.05), endDate: daysFromNow(1) },
  FINISHED: { startDate: daysFromNow(-30), endDate: daysFromNow(-29) }
}

export const aSeedOf = async (hackathon, seed) => {
  await ensureSeedFitsHackathon(seed, hackathon)
  await linkRows('public.hackathon_seeds', { hackathonId: hackathon.id, seedId: seed.id })
  return seed
}

export const anEvaluatorOf = async (hackathon, user) => {
  await insertRow('profiles.evaluators', { id: randomUUID(), userProfileId: user.id, hackathonId: hackathon.id })
  return user
}

export const enrol = (user, hackathon, { roles = ['ARTIST'], interests = 'I want to take part', assisting = false } = {}) =>
  insertTimestampedRow('public.participations', {
    userProfileId: user.id,
    hackathonId: hackathon.id,
    roles,
    interests,
    hasConfirmedAssistance: assisting
  })

const addDescriptionSections = async (hackathon, sections) => {
  for (const [position, section] of sections.entries()) {
    await insertTimestampedRow('public.hackathon_descriptions', { hackathonId: hackathon.id, position, ...section })
  }
}

export const aHackathon = async ({
  edition,
  state = 'PLANNED',
  phase = 'PREPARING',
  type = 'ON_SITE',
  internalName = `Hackathon ${uniqueSuffix()}`,
  shortDescription = 'A short description of the hackathon',
  sections = [{ sectionName: 'About', text: 'What this hackathon is about.' }],
  startDate = DATES_BY_STATE[state].startDate,
  endDate = DATES_BY_STATE[state].endDate,
  location = type === 'ONLINE' ? null : 'Seville',
  meetLink = type === 'ON_SITE' ? null : 'https://meet.example.com/abc-defg-hij',
  isPrivate = false,
  logo = true,
  seeds = [],
  evaluators = [],
  participants = [],
  assisting = []
} = {}) => {
  edition ??= await anAnnouncedEdition()
  ensureHackathonFitsEdition(state, edition)
  const hackathon = await insertTimestampedRow('public.hackathons', {
    internalName,
    isPrivate,
    driveLink: createHackathonFolders({ editionDriveLink: edition.driveLink, internalName, logo }),
    startDate,
    endDate,
    type,
    location,
    description: shortDescription,
    state,
    phase,
    meetLink,
    editionId: edition.id
  })
  await addDescriptionSections(hackathon, sections)
  for (const seed of seeds) await aSeedOf(hackathon, seed)
  for (const user of evaluators) await anEvaluatorOf(hackathon, user)
  for (const user of participants) await enrol(user, hackathon)
  for (const user of assisting) await enrol(user, hackathon, { assisting: true })
  return hackathon
}

export const aNotAnnouncedHackathon = (overrides) => aHackathon({ ...overrides, state: 'PLANNED', phase: 'PREPARING' })
export const anAnnouncedHackathon = (overrides) => aHackathon({ ...overrides, state: 'OPEN', phase: 'PREPARING' })
export const aClosedHackathon = (overrides) => aHackathon({ ...overrides, state: 'CLOSED', phase: 'PREPARING' })
export const anOngoingHackathonAt = (phase, overrides) => aHackathon({ ...overrides, state: 'CLOSED', phase })
export const anEndedHackathon = (overrides) => aHackathon({ ...overrides, state: 'FINISHED', phase: 'TEAM_PRESENTATION' })
