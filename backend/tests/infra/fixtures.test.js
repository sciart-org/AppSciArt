import { describe, expect, it } from 'vitest'
import {
  participant, participants,
  anEdition, aNotAnnouncedEdition, anAnnouncedEdition, aClosedEdition, aPublishedEdition,
  aScientistOf, aSeed, aPublishedSeed,
  aHackathon, aNotAnnouncedHackathon, anAnnouncedHackathon, aClosedHackathon, anOngoingHackathonAt, anEndedHackathon,
  enrol, aGroup, aTeam, drive
} from '../support/index.js'
import { isAuthorOf, isEvaluatorOf, isScientistOf, participationOf, seedIdsOf } from './database.js'

describe('edition fixtures', () => {
  it.each([
    { fixture: 'aNotAnnouncedEdition', createEdition: aNotAnnouncedEdition, state: 'PLANNED' },
    { fixture: 'anAnnouncedEdition', createEdition: anAnnouncedEdition, state: 'ACTIVE' },
    { fixture: 'aClosedEdition', createEdition: aClosedEdition, state: 'CLOSED' },
    { fixture: 'aPublishedEdition', createEdition: aPublishedEdition, state: 'PUBLISHED' }
  ])('$fixture creates an edition in state $state', async ({ createEdition, state }) => {
    const edition = await createEdition()

    expect(edition.state).toBe(state)
  })

  it('an edition has every descriptive field filled in by default', async () => {
    const edition = await anEdition()

    expect(edition).toMatchObject({
      name: expect.any(String),
      year: expect.any(Number),
      shortDescription: expect.any(String),
      longDescription: expect.any(String)
    })
  })

  it('only a published edition has a catalogue link by default', async () => {
    const published = await aPublishedEdition()
    const announced = await anAnnouncedEdition()

    expect(published.catalogLink).toBeTruthy()
    expect(announced.catalogLink).toBeNull()
  })

  it('a field passed as null is left empty', async () => {
    const edition = await aNotAnnouncedEdition({ longDescription: null })

    expect(edition.longDescription).toBeNull()
  })

  it('an edition has a seed master template document in Drive', async () => {
    const edition = await anEdition()

    const master = await drive.seedMasterTemplateOf(edition)

    expect(master).toMatchObject({ name: 'seedTemplate', mimeType: 'application/vnd.google-apps.document' })
  })
})

describe('seed fixtures', () => {
  it('aScientistOf invites the user to that edition', async () => {
    const edition = await anAnnouncedEdition()
    const scientist = participant(1)

    await aScientistOf(edition, scientist)

    expect(await isScientistOf(scientist, edition)).toBe(true)
  })

  it('a seed is in progress by default and aPublishedSeed is published', async () => {
    const inProgress = await aSeed()
    const published = await aPublishedSeed()

    expect(inProgress.state).toBe('IN_PROGRESS')
    expect(published.state).toBe('PUBLISHED')
  })

  it("a seed's authors are its authors and inspiring scientists of its edition", async () => {
    const edition = await anAnnouncedEdition()
    const author = participant(2)

    const seed = await aSeed({ edition, authors: [author] })

    expect(await isAuthorOf(author, seed)).toBe(true)
    expect(await isScientistOf(author, edition)).toBe(true)
  })

  it("a seed's template is a copy of its edition's seed master template", async () => {
    const edition = await anAnnouncedEdition()

    const seed = await aSeed({ edition })

    const master = await drive.seedMasterTemplateOf(edition)
    const copy = await drive.seedTemplateOf(seed)
    expect(copy.copiedFrom).toBe(master.id)
  })
})

describe('hackathon fixtures', () => {
  it.each([
    { fixture: 'aNotAnnouncedHackathon', createHackathon: aNotAnnouncedHackathon, state: 'PLANNED', phase: 'PREPARING' },
    { fixture: 'anAnnouncedHackathon', createHackathon: anAnnouncedHackathon, state: 'OPEN', phase: 'PREPARING' },
    { fixture: 'aClosedHackathon', createHackathon: aClosedHackathon, state: 'CLOSED', phase: 'PREPARING' },
    { fixture: 'anEndedHackathon', createHackathon: anEndedHackathon, state: 'FINISHED', phase: 'TEAM_PRESENTATION' }
  ])('$fixture creates a hackathon in state $state and phase $phase', async ({ createHackathon, state, phase }) => {
    const hackathon = await createHackathon()

    expect(hackathon).toMatchObject({ state, phase })
  })

  it('anOngoingHackathonAt(phase) creates a closed hackathon in that phase', async () => {
    const hackathon = await anOngoingHackathonAt('GROUP_WORK')

    expect(hackathon).toMatchObject({ state: 'CLOSED', phase: 'GROUP_WORK' })
  })

  it('announced hackathons start in the future and ended ones started in the past', async () => {
    const announced = await anAnnouncedHackathon()
    const ended = await anEndedHackathon()

    expect(announced.startDate.getTime()).toBeGreaterThan(Date.now())
    expect(ended.startDate.getTime()).toBeLessThan(Date.now())
  })

  it.each([
    { type: 'ON_SITE', has: 'a location only', expected: { location: 'Seville', meetLink: null } },
    { type: 'ONLINE', has: 'a meet link only', expected: { location: null, meetLink: expect.any(String) } },
    { type: 'HYBRID', has: 'both a location and a meet link', expected: { location: 'Seville', meetLink: expect.any(String) } }
  ])('$type hackathons have $has', async ({ type, expected }) => {
    const hackathon = await aHackathon({ type })

    expect(hackathon).toMatchObject(expected)
  })

  it('seeds, evaluators, participants and assisting participants are attached to the hackathon', async () => {
    const seed = await aPublishedSeed()
    const evaluator = participant(1)
    const enrolledOnly = participant(2)
    const assisting = participant(3)

    const hackathon = await aHackathon({
      seeds: [seed], evaluators: [evaluator], participants: [enrolledOnly], assisting: [assisting]
    })

    expect(await seedIdsOf(hackathon)).toEqual([seed.id])
    expect(await isEvaluatorOf(evaluator, hackathon)).toBe(true)
    expect(await participationOf(enrolledOnly, hackathon)).toMatchObject({ hasConfirmedAssistance: false })
    expect(await participationOf(assisting, hackathon)).toMatchObject({ hasConfirmedAssistance: true })
  })

  it('enrol stores the roles and the reason for joining', async () => {
    const hackathon = await anAnnouncedHackathon()
    const user = participant(4)

    await enrol(user, hackathon, { roles: ['SCIENTIST', 'OTHER'], interests: 'Curious about art' })

    expect(await participationOf(user, hackathon)).toMatchObject({
      roles: ['SCIENTIST', 'OTHER'], interests: 'Curious about art'
    })
  })

  it('a hackathon has a flower master template document in Drive', async () => {
    const hackathon = await aHackathon()

    const master = await drive.flowerMasterTemplateOf(hackathon)

    expect(master).toMatchObject({ name: 'flowerTemplate', mimeType: 'application/vnd.google-apps.document' })
  })
})

describe('group and team fixtures', () => {
  const ongoingHackathonWith = async (members) => {
    const seed = await aPublishedSeed()
    const hackathon = await anOngoingHackathonAt('GROUP_WORK', { seeds: [seed], assisting: members })
    return { hackathon, seed }
  }

  it('a group puts its members in it and makes only the voice its voice', async () => {
    const [voice, member] = participants(2, 5)
    const { hackathon, seed } = await ongoingHackathonWith([voice, member])

    const group = await aGroup({ hackathon, seed, members: [voice, member], voice })

    expect(await participationOf(voice, hackathon)).toMatchObject({ groupId: group.id, isGroupVoice: true })
    expect(await participationOf(member, hackathon)).toMatchObject({ groupId: group.id, isGroupVoice: false })
  })

  it('a group can start with its map delivered', async () => {
    const [voice] = participants(1, 7)
    const { hackathon, seed } = await ongoingHackathonWith([voice])

    const group = await aGroup({ hackathon, seed, members: [voice], delivered: true })

    expect(group.isDelivered).toBe(true)
  })

  it('a group cannot include someone who is not enrolled in the hackathon', async () => {
    const { hackathon, seed } = await ongoingHackathonWith([])
    const notEnrolled = participant(8)

    await expect(aGroup({ hackathon, seed, members: [notEnrolled] })).rejects.toThrow('is not enrolled')
  })

  it('a team puts its members in it and makes only the speaker its speaker', async () => {
    const [speaker, member] = participants(2, 9)
    const { hackathon, seed } = await ongoingHackathonWith([speaker, member])

    const flower = await aTeam({ hackathon, seed, members: [speaker, member], speaker })

    expect(await participationOf(speaker, hackathon)).toMatchObject({ teamId: flower.id, isTeamSpeaker: true })
    expect(await participationOf(member, hackathon)).toMatchObject({ teamId: flower.id, isTeamSpeaker: false })
  })

  it("a team's flower template is a copy of its hackathon's flower master template", async () => {
    const [speaker] = participants(1, 11)
    const { hackathon, seed } = await ongoingHackathonWith([speaker])

    const flower = await aTeam({ hackathon, seed, members: [speaker] })

    const master = await drive.flowerMasterTemplateOf(hackathon)
    const copy = await drive.flowerTemplateOf(flower)
    expect(copy.copiedFrom).toBe(master.id)
  })
})
