import { describe, it, expect, beforeAll } from 'vitest'
import {
  asGuest,
  as,
  administrator,
  designer,
  facilitator,
  participant,
  anAnnouncedEdition,
  aNotAnnouncedHackathon,
  anAnnouncedHackathon,
  aClosedHackathon,
  anOngoingHackathonAt,
  anEndedHackathon,
  anEvaluatorOf
} from '../support/index.js'

const REQUIRED_HACKATHON_LIST_FIELDS = ['id', 'state', 'phase', 'type', 'startDate', 'endDate', 'shortDescription', 'logo', 'editionName']

const ALLOWED_HACKATHON_LIST_FIELDS = [...REQUIRED_HACKATHON_LIST_FIELDS, 'location']

const ALLOWED_PARTICIPANT_HACKATHON_LIST_FIELDS = [...ALLOWED_HACKATHON_LIST_FIELDS, 'isEnrolled']

const ALLOWED_STAFF_HACKATHON_LIST_FIELDS = [...ALLOWED_PARTICIPANT_HACKATHON_LIST_FIELDS, 'internalName', 'isPrivate', 'driveLink']

const STAFF_ONLY_FIELDS = ['internalName', 'isPrivate', 'driveLink']

const fieldsOutsideAllowed = (item, allowed = ALLOWED_HACKATHON_LIST_FIELDS) =>
  Object.keys(item).filter((key) => !allowed.includes(key))

const idsOf = (hackathons) => hackathons.map((hackathon) => hackathon.id)

const sortedIdsOf = (hackathons) => idsOf(hackathons).sort()

const listedBy = async (api) => {
  const res = await api.get('/hackathons')
  expect(res.status).toBe(200)
  expect(res.body).toEqual(expect.any(Array))
  return res.body
}

const itemOf = (hackathons, hackathon) => hackathons.find((item) => item.id === hackathon.id)

const STAFF_ROLES = [
  ['designer', () => designer(1)],
  ['facilitator', () => facilitator(1)],
  ['administrator', () => administrator(1)]
]

describe('UC-004 · IRQ-006 · when no hackathon is publicly visible', () => {
  it('UC-004 · guest gets an empty list when no hackathon exists', async () => {
    const res = await asGuest().get('/hackathons')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('UC-004 · IRQ-006 · guest gets an empty list when only not-announced and private hackathons exist', async () => {
    await aNotAnnouncedHackathon()
    await anAnnouncedHackathon({ isPrivate: true })
    await anEndedHackathon({ isPrivate: true })

    const res = await asGuest().get('/hackathons')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('UC-004 · IRQ-006 · when hackathons in every state exist', () => {
  let notAnnounced, announced, closed, ongoing, ended
  let privateNotAnnounced, privateAnnounced, privateClosed, privateOngoing, privateEnded

  beforeAll(async () => {
    notAnnounced = await aNotAnnouncedHackathon()
    announced = await anAnnouncedHackathon()
    closed = await aClosedHackathon()
    ongoing = await anOngoingHackathonAt('GROUP_WORK')
    ended = await anEndedHackathon()
    privateNotAnnounced = await aNotAnnouncedHackathon({ isPrivate: true })
    privateAnnounced = await anAnnouncedHackathon({ isPrivate: true })
    privateClosed = await aClosedHackathon({ isPrivate: true })
    privateOngoing = await anOngoingHackathonAt('TEAM_WORK', { isPrivate: true })
    privateEnded = await anEndedHackathon({ isPrivate: true })
  })

  const publicOnes = () => [announced, closed, ongoing, ended]

  const privateOnes = () => [privateNotAnnounced, privateAnnounced, privateClosed, privateOngoing, privateEnded]

  it('UC-004 · IRQ-006 · guest sees announced, closed, ongoing and ended hackathons', async () => {
    const hackathons = await listedBy(asGuest())

    expect(idsOf(hackathons)).toEqual(expect.arrayContaining(idsOf(publicOnes())))
  })

  it('UC-004 · IRQ-006 · guest never sees not-announced hackathons', async () => {
    const hackathons = await listedBy(asGuest())

    expect(idsOf(hackathons)).not.toContain(notAnnounced.id)
    expect(hackathons.map((hackathon) => hackathon.state)).not.toContain('PLANNED')
  })

  it('UC-004 · IRQ-006 · guest never sees private hackathons, whatever their state', async () => {
    const hackathons = await listedBy(asGuest())

    for (const hidden of privateOnes()) {
      expect(idsOf(hackathons)).not.toContain(hidden.id)
    }
  })

  it('UC-004 · IRQ-006 · participant sees exactly the same hackathons as a guest', async () => {
    const api = await as(participant(1))

    const participantHackathons = await listedBy(api)
    const guestHackathons = await listedBy(asGuest())

    expect(sortedIdsOf(participantHackathons)).toEqual(sortedIdsOf(guestHackathons))
  })

  it.each(STAFF_ROLES)('UC-004 · IRQ-006 · %s sees not-announced and private hackathons too', async (_role, staffMember) => {
    const api = await as(staffMember())

    const hackathons = await listedBy(api)

    expect(idsOf(hackathons)).toEqual(expect.arrayContaining([
      notAnnounced.id,
      ...idsOf(publicOnes()),
      ...idsOf(privateOnes())
    ]))
  })
})

describe('UC-004 · IRQ-006 · list item fields', () => {
  let edition, onSite, online, hybrid

  beforeAll(async () => {
    edition = await anAnnouncedEdition({ name: 'Edition of the listed hackathons' })
    onSite = await anAnnouncedHackathon({ edition, type: 'ON_SITE', shortDescription: 'On-site hackathon' })
    online = await anAnnouncedHackathon({ edition, type: 'ONLINE', shortDescription: 'Online hackathon' })
    hybrid = await anOngoingHackathonAt('GROUP_CREATION', { edition, type: 'HYBRID', shortDescription: 'Hybrid hackathon' })
  })

  it('UC-004 · IRQ-006 · guest list items have no field outside the allowed set', async () => {
    const hackathons = await listedBy(asGuest())

    for (const item of hackathons) {
      expect(fieldsOutsideAllowed(item)).toEqual([])
    }
  })

  it('UC-004 · IRQ-006 · guest list items carry every required field', async () => {
    const hackathons = await listedBy(asGuest())

    for (const created of [onSite, online, hybrid]) {
      const item = itemOf(hackathons, created)
      for (const field of REQUIRED_HACKATHON_LIST_FIELDS) {
        expect(item).toHaveProperty(field)
      }
      expect(item).toMatchObject({
        id: created.id,
        state: created.state,
        type: created.type,
        shortDescription: created.shortDescription,
        logo: expect.any(String)
      })
    }
  })

  it('UC-004 · IRQ-006 · an online hackathon has no location and an on-site one has its location', async () => {
    const hackathons = await listedBy(asGuest())

    expect(itemOf(hackathons, online).location ?? null).toBeNull()
    expect(itemOf(hackathons, onSite).location).toBe(onSite.location)
    expect(itemOf(hackathons, onSite).location).toEqual(expect.any(String))
  })

  it('UC-004 · IRQ-006 · editionName is the name of the hackathon\'s edition', async () => {
    const hackathons = await listedBy(asGuest())

    for (const created of [onSite, online, hybrid]) {
      expect(itemOf(hackathons, created).editionName).toBe(edition.name)
    }
  })

  it('UC-004 · guest items carry no isEnrolled', async () => {
    const hackathons = await listedBy(asGuest())

    for (const item of hackathons) {
      expect(item).not.toHaveProperty('isEnrolled')
    }
  })

  it('UC-004 · IRQ-006 · participant items all carry a boolean isEnrolled and no staff-only field', async () => {
    const api = await as(participant(1))

    const hackathons = await listedBy(api)

    for (const item of hackathons) {
      expect(item.isEnrolled).toEqual(expect.any(Boolean))
      for (const field of STAFF_ONLY_FIELDS) {
        expect(item).not.toHaveProperty(field)
      }
    }
  })

  it('UC-004 · IRQ-006 · participant items have no field outside the allowed set', async () => {
    const api = await as(participant(1))

    const hackathons = await listedBy(api)

    for (const item of hackathons) {
      expect(fieldsOutsideAllowed(item, ALLOWED_PARTICIPANT_HACKATHON_LIST_FIELDS)).toEqual([])
    }
  })

  it.each(STAFF_ROLES)('UC-004 · IRQ-006 · %s items have no field outside the staff set', async (_role, staffMember) => {
    const api = await as(staffMember())

    const hackathons = await listedBy(api)

    for (const item of hackathons) {
      expect(fieldsOutsideAllowed(item, ALLOWED_STAFF_HACKATHON_LIST_FIELDS)).toEqual([])
    }
  })

  it.each([
    ['guest', async () => asGuest()],
    ['participant', () => as(participant(1))],
    ['designer', () => as(designer(1))]
  ])('UC-004 · IRQ-006 · %s never gets the meeting link in the list', async (_actor, clientOf) => {
    const api = await clientOf()

    const hackathons = await listedBy(api)

    expect(idsOf(hackathons)).toEqual(expect.arrayContaining([online.id, hybrid.id]))
    for (const item of hackathons) {
      expect(item).not.toHaveProperty('meetLink')
    }
  })
})

describe('UC-004 · enrolment mark', () => {
  let enrolledAnnounced, enrolledEnded, notEnrolledAnnounced, notEnrolledOngoing
  let enrolledOngoing, assistingOngoing, evaluatedOngoing

  beforeAll(async () => {
    enrolledAnnounced = await anAnnouncedHackathon({ participants: [participant(2)] })
    enrolledEnded = await anEndedHackathon({ participants: [participant(2)] })
    enrolledOngoing = await anOngoingHackathonAt('GROUP_WORK', { participants: [participant(2)] })
    notEnrolledAnnounced = await anAnnouncedHackathon({ participants: [participant(5)] })
    notEnrolledOngoing = await anOngoingHackathonAt('TEAM_CREATION', { participants: [participant(5)] })
    assistingOngoing = await anOngoingHackathonAt('GROUP_CREATION', { assisting: [participant(3)] })
    evaluatedOngoing = await anOngoingHackathonAt('GROUP_PRESENTATION')
    await anEvaluatorOf(evaluatedOngoing, participant(4))
  })

  it('UC-004 · a participant\'s announced and ended hackathons they take part in are marked enrolled, others not', async () => {
    const api = await as(participant(2))

    const hackathons = await listedBy(api)

    expect(itemOf(hackathons, enrolledAnnounced).isEnrolled).toBe(true)
    expect(itemOf(hackathons, enrolledEnded).isEnrolled).toBe(true)
    expect(itemOf(hackathons, enrolledOngoing).isEnrolled).toBe(true)
    expect(itemOf(hackathons, notEnrolledAnnounced).isEnrolled).toBe(false)
    expect(itemOf(hackathons, notEnrolledOngoing).isEnrolled).toBe(false)
  })

  it('UC-004 · an assisting participant\'s hackathon is marked enrolled', async () => {
    const api = await as(participant(3))

    const hackathons = await listedBy(api)

    expect(itemOf(hackathons, assistingOngoing).isEnrolled).toBe(true)
  })

  it('UC-004 · being an evaluator of a hackathon does not mark it as enrolled', async () => {
    const api = await as(participant(4))

    const hackathons = await listedBy(api)

    expect(itemOf(hackathons, evaluatedOngoing).isEnrolled).toBe(false)
  })
})
