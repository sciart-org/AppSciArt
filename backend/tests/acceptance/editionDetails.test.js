import { randomUUID } from 'node:crypto'
import { describe, it, expect, beforeAll } from 'vitest'
import {
  asGuest,
  as,
  administrator,
  designer,
  facilitator,
  participant,
  aNotAnnouncedEdition,
  anAnnouncedEdition,
  aClosedEdition,
  aPublishedEdition,
  aFruit
} from '../support/index.js'

const LINK = /^https?:\/\/\S+$/

const ALLOWED_EDITION_DETAILS_FIELDS = [
  'id', 'state', 'name', 'year', 'logo', 'shortDescription', 'longDescription', 'fruits', 'catalogLink'
]

const ALLOWED_STAFF_EDITION_DETAILS_FIELDS = [...ALLOWED_EDITION_DETAILS_FIELDS, 'driveLink']

const ALLOWED_FRUIT_FIELDS = ['id', 'mainImage', 'title']

const REQUIRED_EDITION_DETAILS = {
  id: expect.any(String),
  state: expect.any(String),
  name: expect.any(String),
  year: expect.any(Number),
  logo: expect.stringMatching(LINK),
  shortDescription: expect.any(String),
  longDescription: expect.any(String),
  fruits: expect.any(Array)
}

const UNPUBLISHED_FRUIT_STATES = ['IN_BLANK', 'IN_PROGRESS', 'IN_REVIEW']

const fieldsOutsideAllowed = (item, allowed = ALLOWED_EDITION_DETAILS_FIELDS) =>
  Object.keys(item).filter((key) => !allowed.includes(key))

const fruitIdsOf = (details) => (details.fruits ?? []).map((fruit) => fruit.id)

const idsOf = (items) => items.map((item) => item.id)

const guestClient = async () => asGuest()

const ACTORS = [
  ['guest', guestClient],
  ['participant', () => as(participant(1))],
  ['designer', () => as(designer(1))],
  ['facilitator', () => as(facilitator(1))],
  ['administrator', () => as(administrator(1))]
]

const STAFF = [
  ['designer', () => designer(1)],
  ['facilitator', () => facilitator(1)],
  ['administrator', () => administrator(1)]
]

const EDITION_STATES = ['announced', 'closed', 'published']

const ACTORS_BY_EDITION_STATE = ACTORS.flatMap(([actor, client]) =>
  EDITION_STATES.map((editionState) => [actor, editionState, client])
)

const detailsOf = async (api, edition) => {
  const res = await api.get(`/editions/${edition.id}`)
  expect(res.status).toBe(200)
  return res.body
}

describe('UC-003 · edition details', () => {
  let notAnnounced, incomplete, otherPublished, otherEditionFruit
  const editions = {}
  const publishedFruits = {}
  const unpublishedFruits = {}

  const fruitsFor = async (label, edition) => {
    publishedFruits[label] = [
      await aFruit({ edition, state: 'PUBLISHED', title: `First published fruit of the ${label} edition` }),
      await aFruit({ edition, state: 'PUBLISHED', title: `Second published fruit of the ${label} edition` })
    ]
    unpublishedFruits[label] = []
    for (const state of UNPUBLISHED_FRUIT_STATES) {
      unpublishedFruits[label].push(await aFruit({ edition, state, title: `${state} fruit of the ${label} edition` }))
    }
  }

  beforeAll(async () => {
    notAnnounced = await aNotAnnouncedEdition({ name: 'Planned', year: 2027 })
    incomplete = await aNotAnnouncedEdition({ shortDescription: null, longDescription: null, logo: false })
    editions.announced = await anAnnouncedEdition({
      name: 'Announced',
      year: 2026,
      shortDescription: 'Announced edition',
      longDescription: 'The full description of the announced edition topic'
    })
    editions.closed = await aClosedEdition({
      name: 'Closed',
      year: 2025,
      shortDescription: 'Closed edition',
      longDescription: 'The full description of the closed edition topic'
    })
    editions.published = await aPublishedEdition({
      name: 'Published',
      year: 2024,
      shortDescription: 'Published edition',
      longDescription: 'The full description of the published edition topic'
    })
    otherPublished = await aPublishedEdition({ name: 'Other published', year: 2023 })

    for (const label of EDITION_STATES) {
      await fruitsFor(label, editions[label])
    }
    otherEditionFruit = await aFruit({ edition: otherPublished, state: 'PUBLISHED', title: 'Fruit of another edition' })
  })

  describe('UC-003 · access', () => {
    it('UC-003 · guest gets the details of an announced edition', async () => {
      const res = await asGuest().get(`/editions/${editions.announced.id}`)

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: editions.announced.id, state: 'ACTIVE' })
    })

    it.each([
      ['closed', 'CLOSED'],
      ['published', 'PUBLISHED']
    ])('UC-003 · guest gets the details of a %s edition', async (label, state) => {
      const res = await asGuest().get(`/editions/${editions[label].id}`)

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: editions[label].id, state })
    })

    it('UC-003 · guest asking for a not-announced edition gets 404', async () => {
      const res = await asGuest().get(`/editions/${notAnnounced.id}`)

      expect(res.status).toBe(404)
    })

    it('UC-003 · participant asking for a not-announced edition gets 404', async () => {
      const api = await as(participant(1))

      const res = await api.get(`/editions/${notAnnounced.id}`)

      expect(res.status).toBe(404)
    })

    it.each(STAFF)('UC-003 · %s gets the details of a not-announced edition', async (_role, staffMember) => {
      const api = await as(staffMember())

      const res = await api.get(`/editions/${notAnnounced.id}`)

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: notAnnounced.id, state: 'PLANNED' })
    })

    it.each(STAFF)('UC-003 · %s gets the details of a not-announced edition with no descriptions and no logo', async (_role, staffMember) => {
      const api = await as(staffMember())

      const res = await api.get(`/editions/${incomplete.id}`)

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: incomplete.id, state: 'PLANNED' })
    })

    it('UC-003 · guest asking for an unknown edition gets 404', async () => {
      const res = await asGuest().get(`/editions/${randomUUID()}`)

      expect(res.status).toBe(404)
    })

    it('UC-003 · staff asking for an unknown edition gets 404', async () => {
      const api = await as(designer(1))

      const res = await api.get(`/editions/${randomUUID()}`)

      expect(res.status).toBe(404)
    })
  })

  describe('UC-003 · IRQ-005 · fields', () => {
    it.each(EDITION_STATES)('UC-003 · IRQ-005 · guest details of an edition that is %s have every required field', async (label) => {
      const details = await detailsOf(asGuest(), editions[label])

      expect(details).toMatchObject(REQUIRED_EDITION_DETAILS)
    })

    it.each(EDITION_STATES)('UC-003 · IRQ-005 · guest details of an edition that is %s have no field outside the public set', async (label) => {
      const details = await detailsOf(asGuest(), editions[label])

      expect(fieldsOutsideAllowed(details)).toEqual([])
    })

    it.each(EDITION_STATES)('UC-003 · IRQ-005 · guest details of an edition that is %s show its full description', async (label) => {
      const details = await detailsOf(asGuest(), editions[label])

      expect(details.longDescription).toBe(editions[label].longDescription)
    })

    it('UC-003 · IRQ-005 · participant details have every required field', async () => {
      const api = await as(participant(1))

      const details = await detailsOf(api, editions.announced)

      expect(details).toMatchObject(REQUIRED_EDITION_DETAILS)
    })

    it('UC-003 · IRQ-005 · participant details have no field outside the public set', async () => {
      const api = await as(participant(1))

      const details = await detailsOf(api, editions.announced)

      expect(fieldsOutsideAllowed(details)).toEqual([])
    })

    it('UC-003 · IRQ-005 · participant details have no Drive link', async () => {
      const api = await as(participant(1))

      const details = await detailsOf(api, editions.announced)

      expect(details).not.toHaveProperty('driveLink')
    })

    it.each(STAFF)('UC-003 · IRQ-005 · %s details have every required field and the Drive link', async (_role, staffMember) => {
      const api = await as(staffMember())

      const details = await detailsOf(api, editions.announced)

      expect(details).toMatchObject({ ...REQUIRED_EDITION_DETAILS, driveLink: expect.stringMatching(LINK) })
    })

    it.each(STAFF)('UC-003 · IRQ-005 · %s details have no field outside the public set plus the Drive link', async (_role, staffMember) => {
      const api = await as(staffMember())

      const details = await detailsOf(api, editions.announced)

      expect(fieldsOutsideAllowed(details, ALLOWED_STAFF_EDITION_DETAILS_FIELDS)).toEqual([])
    })

    it('UC-003 · IRQ-005 · published edition details include its catalogue link', async () => {
      const details = await detailsOf(asGuest(), editions.published)

      expect(details.catalogLink).toEqual(expect.stringMatching(LINK))
      expect(details.catalogLink).toBe(editions.published.catalogLink)
    })

    it.each(['announced', 'closed'])('UC-003 · IRQ-005 · %s edition details have no catalogue link', async (label) => {
      const details = await detailsOf(asGuest(), editions[label])

      expect(details.catalogLink ?? null).toBeNull()
    })
  })

  describe('UC-003 · fruits', () => {
    it.each(ACTORS_BY_EDITION_STATE)('UC-003 · %s sees the published fruits of an edition that is %s', async (_actor, label, client) => {
      const api = await client()

      const details = await detailsOf(api, editions[label])

      expect(fruitIdsOf(details)).toEqual(expect.arrayContaining(idsOf(publishedFruits[label])))
    })

    it.each(ACTORS_BY_EDITION_STATE)('UC-003 · %s sees each fruit of an edition that is %s with its id, main image link and title', async (_actor, label, client) => {
      const api = await client()

      const details = await detailsOf(api, editions[label])

      expect(details.fruits).toEqual(expect.any(Array))
      for (const fruit of details.fruits) {
        expect(fruit).toMatchObject({
          id: expect.any(String),
          mainImage: expect.stringMatching(LINK),
          title: expect.any(String)
        })
      }
      for (const created of publishedFruits[label]) {
        const listed = details.fruits.find((fruit) => fruit.id === created.id)
        expect(listed).toMatchObject({ title: created.title })
      }
    })

    it.each(ACTORS_BY_EDITION_STATE)('UC-003 · %s sees no field outside id, main image and title in the fruits of an edition that is %s', async (_actor, label, client) => {
      const api = await client()

      const details = await detailsOf(api, editions[label])

      expect(details.fruits).toEqual(expect.any(Array))
      for (const fruit of details.fruits) {
        expect(fieldsOutsideAllowed(fruit, ALLOWED_FRUIT_FIELDS)).toEqual([])
      }
    })

    it.each(ACTORS_BY_EDITION_STATE)('UC-003 · %s does not see the unpublished fruits of an edition that is %s', async (_actor, label, client) => {
      const api = await client()

      const details = await detailsOf(api, editions[label])

      for (const fruit of unpublishedFruits[label]) {
        expect(fruitIdsOf(details)).not.toContain(fruit.id)
      }
    })

    it.each(EDITION_STATES)('UC-003 · details of an edition that is %s do not list fruits of other editions', async (label) => {
      const details = await detailsOf(asGuest(), editions[label])

      expect(fruitIdsOf(details)).not.toContain(otherEditionFruit.id)
    })
  })
})
