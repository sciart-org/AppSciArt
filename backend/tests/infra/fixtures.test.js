import { describe, expect, it } from 'vitest'
import {
  participant, participants,
  anEdition, aNotAnnouncedEdition, anAnnouncedEdition, aClosedEdition, aPublishedEdition,
  aScientistOf, aSeed, aPublishedSeed, aSeedOfEdition,
  aHackathon, aNotAnnouncedHackathon, anAnnouncedHackathon, aClosedHackathon, anOngoingHackathonAt, anEndedHackathon,
  enrol, aGroup, aTeam, aFruit, drive
} from '../support/index.js'
import { editionIdsOf, fruitChainOf, isAuthorOf, isEvaluatorOf, isScientistOf, participationOf, seedIdsOf } from './database.js'
import { childrenOf, folderIdFromLink, PNG_MIME } from '../support/fakes/driveStore.js'

const imagesIn = (row) =>
  childrenOf(folderIdFromLink(row.driveLink)).filter(file => file.mimeType === PNG_MIME)

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

  it('an edition has a logo image in its Drive folder', async () => {
    const edition = await anEdition()

    expect(imagesIn(edition)).toEqual([expect.objectContaining({ name: 'logo.png', mimeType: 'image/png' })])
  })

  it('an edition created with logo: false has no logo image', async () => {
    const edition = await anEdition({ logo: false })

    expect(imagesIn(edition)).toEqual([])
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

  it('a seed has a main image in its Drive folder and a PDF link by default', async () => {
    const seed = await aSeed()

    expect(imagesIn(seed)).toEqual([expect.objectContaining({ name: 'mainImage.png' })])
    expect(seed.seedPDF).toBeTruthy()
  })

  it('a seed created with mainImage: false and seedPDF: null has neither', async () => {
    const seed = await aSeed({ mainImage: false, seedPDF: null })

    expect(imagesIn(seed)).toEqual([])
    expect(seed.seedPDF).toBeNull()
  })

  it('aSeedOfEdition adds the seed to another edition', async () => {
    const [first, second] = [await anAnnouncedEdition(), await anAnnouncedEdition()]
    const seed = await aSeed({ edition: first })

    await aSeedOfEdition(second, seed)

    expect(await editionIdsOf(seed)).toEqual(expect.arrayContaining([first.id, second.id]))
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
    const edition = await anAnnouncedEdition()
    const seed = await aPublishedSeed({ edition })
    const evaluator = participant(1)
    const enrolledOnly = participant(2)
    const assisting = participant(3)

    const hackathon = await aHackathon({
      edition,
      seeds: [seed],
      evaluators: [evaluator],
      participants: [enrolledOnly],
      assisting: [assisting]
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

  it('a hackathon has a logo image in its Drive folder', async () => {
    const hackathon = await aHackathon()

    expect(imagesIn(hackathon)).toEqual([expect.objectContaining({ name: 'logo.png', mimeType: 'image/png' })])
  })

  it('a hackathon created with logo: false has no logo image', async () => {
    const hackathon = await aHackathon({ logo: false })

    expect(imagesIn(hackathon)).toEqual([])
  })
})

describe('group and team fixtures', () => {
  const ongoingHackathonWith = async (members, phase = 'GROUP_WORK') => {
    const edition = await anAnnouncedEdition()
    const seed = await aPublishedSeed({ edition })
    const hackathon = await anOngoingHackathonAt(phase, { edition, seeds: [seed], assisting: members })
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
    const { hackathon, seed } = await ongoingHackathonWith([speaker, member], 'TEAM_WORK')

    const flower = await aTeam({ hackathon, seed, members: [speaker, member], speaker })

    expect(await participationOf(speaker, hackathon)).toMatchObject({ teamId: flower.id, isTeamSpeaker: true })
    expect(await participationOf(member, hackathon)).toMatchObject({ teamId: flower.id, isTeamSpeaker: false })
  })

  it("a team's flower template is a copy of its hackathon's flower master template", async () => {
    const [speaker] = participants(1, 11)
    const { hackathon, seed } = await ongoingHackathonWith([speaker], 'TEAM_WORK')

    const flower = await aTeam({ hackathon, seed, members: [speaker] })

    const master = await drive.flowerMasterTemplateOf(hackathon)
    const copy = await drive.flowerTemplateOf(flower)
    expect(copy.copiedFrom).toBe(master.id)
  })

  it.each(['IN_REVIEW', 'PUBLISHED'])('a %s flower has a title, a concept and a main image', async (flowerState) => {
    const [speaker] = participants(1, 13)
    const { hackathon, seed } = await ongoingHackathonWith([speaker], 'TEAM_WORK')

    const flower = await aTeam({ hackathon, seed, members: [speaker], flowerState })

    expect(flower).toMatchObject({ title: expect.any(String), concept: expect.any(String) })
    expect(imagesIn(flower)).toEqual([expect.objectContaining({ name: 'mainImage.png' })])
  })

  it('a blank flower has no title or concept', async () => {
    const [speaker] = participants(1, 13)
    const { hackathon, seed } = await ongoingHackathonWith([speaker], 'TEAM_WORK')

    const flower = await aTeam({ hackathon, seed, members: [speaker] })

    expect(flower).toMatchObject({ title: null, concept: null })
  })

  it('a team created with mainImage: false has a flower without a main image', async () => {
    const [speaker] = participants(1, 13)
    const { hackathon, seed } = await ongoingHackathonWith([speaker], 'TEAM_WORK')

    const flower = await aTeam({ hackathon, seed, members: [speaker], mainImage: false })

    expect(imagesIn(flower)).toEqual([])
  })
})

describe('state consistency', () => {
  const EDITION_FIXTURES = {
    PLANNED: aNotAnnouncedEdition,
    ACTIVE: anAnnouncedEdition,
    CLOSED: aClosedEdition,
    PUBLISHED: aPublishedEdition
  }

  it.each([
    ['PLANNED', 'PLANNED'],
    ['ACTIVE', 'PLANNED'], ['ACTIVE', 'OPEN'], ['ACTIVE', 'CLOSED'], ['ACTIVE', 'FINISHED'],
    ['CLOSED', 'FINISHED'],
    ['PUBLISHED', 'FINISHED']
  ])('a %s edition can have a %s hackathon', async (editionState, hackathonState) => {
    const edition = await EDITION_FIXTURES[editionState]()

    const hackathon = await aHackathon({ edition, state: hackathonState })

    expect(hackathon.state).toBe(hackathonState)
  })

  it.each([
    ['PLANNED', 'OPEN'], ['PLANNED', 'CLOSED'], ['PLANNED', 'FINISHED'],
    ['CLOSED', 'PLANNED'], ['CLOSED', 'OPEN'], ['CLOSED', 'CLOSED'],
    ['PUBLISHED', 'PLANNED'], ['PUBLISHED', 'OPEN'], ['PUBLISHED', 'CLOSED']
  ])('a %s edition cannot have a %s hackathon', async (editionState, hackathonState) => {
    const edition = await EDITION_FIXTURES[editionState]()

    await expect(aHackathon({ edition, state: hackathonState })).rejects.toThrow('Unreachable state')
  })

  it('a hackathon cannot use an unpublished seed', async () => {
    const edition = await anAnnouncedEdition()
    const seed = await aSeed({ edition })

    await expect(aHackathon({ edition, seeds: [seed] })).rejects.toThrow('must be published')
  })

  it('a hackathon cannot use a seed of another edition', async () => {
    const seed = await aPublishedSeed()

    await expect(aHackathon({ seeds: [seed] })).rejects.toThrow('must belong to its edition')
  })

  it.each(['GROUP_CREATION', 'GROUP_WORK', 'GROUP_PRESENTATION'])('a team cannot exist in phase %s', async (phase) => {
    const edition = await anAnnouncedEdition()
    const seed = await aPublishedSeed({ edition })
    const hackathon = await anOngoingHackathonAt(phase, { edition, seeds: [seed] })

    await expect(aTeam({ hackathon, seed })).rejects.toThrow('Unreachable state')
  })

  const hackathonAndUnassignedSeed = async (phase) => {
    const edition = await anAnnouncedEdition()
    const hackathon = await anOngoingHackathonAt(phase, { edition })
    return { hackathon, seed: await aPublishedSeed({ edition }) }
  }

  it('a group cannot use a seed that is not assigned to its hackathon', async () => {
    const { hackathon, seed } = await hackathonAndUnassignedSeed('GROUP_WORK')

    await expect(aGroup({ hackathon, seed })).rejects.toThrow("only use their hackathon's seeds")
  })

  it('a team cannot use a seed that is not assigned to its hackathon', async () => {
    const { hackathon, seed } = await hackathonAndUnassignedSeed('TEAM_WORK')

    await expect(aTeam({ hackathon, seed })).rejects.toThrow("only use their hackathon's seeds")
  })
})

describe('fruit fixtures', () => {
  it('aFruit builds its chain inside the given edition: an ended hackathon and a published flower', async () => {
    const edition = await aPublishedEdition()

    const fruit = await aFruit({ edition, state: 'IN_PROGRESS' })

    expect(await fruitChainOf(fruit)).toMatchObject({
      fruitState: 'IN_PROGRESS', flowerState: 'PUBLISHED', hackathonState: 'FINISHED', editionId: edition.id
    })
  })

  it('aFruit returns the flower, seed and hackathon it was built from', async () => {
    const hackathon = await anEndedHackathon()

    const fruit = await aFruit({ hackathon })

    expect(await fruitChainOf(fruit)).toMatchObject({ flowerId: fruit.flower.id, seedId: fruit.seed.id })
    expect(fruit.hackathon.id).toBe(hackathon.id)
  })

  it("the fruit's authors are linked to it in its hackathon", async () => {
    const hackathon = await anEndedHackathon()
    const [author, coAuthor] = participants(2, 12)

    const fruit = await aFruit({ hackathon, authors: [author, coAuthor] })

    expect(await participationOf(author, hackathon)).toMatchObject({ fruitId: fruit.id })
    expect(await participationOf(coAuthor, hackathon)).toMatchObject({ fruitId: fruit.id })
  })

  it('a fruit has a main image in its Drive folder', async () => {
    const fruit = await aFruit()

    expect(imagesIn(fruit)).toEqual([expect.objectContaining({ name: 'mainImage.png' })])
  })

  it("a fruit has its authors' vision, curator's vision and seed description by default", async () => {
    const fruit = await aFruit()

    expect(fruit).toMatchObject({
      authorVision: expect.any(String), curatorVision: expect.any(String), seedDescription: expect.any(String)
    })
  })

  it('a fruit created with mainImage: false has no main image', async () => {
    const fruit = await aFruit({ mainImage: false })

    expect(imagesIn(fruit)).toEqual([])
  })

  it('a fruit cannot exist for a hackathon that has not ended', async () => {
    const hackathon = await anOngoingHackathonAt('TEAM_PRESENTATION')

    await expect(aFruit({ hackathon })).rejects.toThrow('Unreachable state')
  })
})
