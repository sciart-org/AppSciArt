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
  aPublishedEdition
} from '../support/index.js'

const ALLOWED_EDITION_LIST_FIELDS = ['id', 'state', 'name', 'year', 'shortDescription', 'logo', 'fruitLogo']

const ALLOWED_STAFF_EDITION_LIST_FIELDS = [...ALLOWED_EDITION_LIST_FIELDS, 'driveLink']

const REQUIRED_EDITION_LIST_FIELDS = ['id', 'state', 'name', 'year', 'shortDescription', 'logo']

const REQUIRED_STAFF_FIELDS_OF_ANY_EDITION = ['id', 'state', 'name', 'year', 'driveLink']

const REQUIRED_STAFF_FIELDS_OF_ANNOUNCED_EDITION = [...REQUIRED_STAFF_FIELDS_OF_ANY_EDITION, 'shortDescription', 'logo']

const LINK = /^https?:\/\/\S+$/

const fieldsOutsideAllowed = (item, allowed = ALLOWED_EDITION_LIST_FIELDS) =>
  Object.keys(item).filter((key) => !allowed.includes(key))

const missingRequiredFields = (item, required) =>
  required.filter((key) => item[key] === undefined || item[key] === null)

const requiredStaffFieldsOf = (item) =>
  item.state === 'PLANNED' ? REQUIRED_STAFF_FIELDS_OF_ANY_EDITION : REQUIRED_STAFF_FIELDS_OF_ANNOUNCED_EDITION

const idsOf = (editions) => editions.map((edition) => edition.id)

const statesOf = (editions) => editions.map((edition) => edition.state)

const STAFF_ROLES = [
  ['designer', () => designer(1)],
  ['facilitator', () => facilitator(1)],
  ['administrator', () => administrator(1)]
]

describe('UC-002 · when no edition is publicly visible', () => {
  it('UC-002 · guest gets an empty list when no edition exists', async () => {
    const res = await asGuest().get('/editions')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('UC-002 · guest gets an empty list when only not-announced editions exist', async () => {
    await aNotAnnouncedEdition()
    await aNotAnnouncedEdition()

    const res = await asGuest().get('/editions')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})

describe('UC-002 · when editions in every state exist', () => {
  let notAnnounced, incompleteNotAnnounced, announced, closed, published

  beforeAll(async () => {
    notAnnounced = await aNotAnnouncedEdition({ name: 'Not announced', year: 2027 })
    incompleteNotAnnounced = await aNotAnnouncedEdition({
      name: 'Incomplete not announced',
      year: 2028,
      shortDescription: null,
      logo: false
    })
    announced = await anAnnouncedEdition({ name: 'Announced', year: 2026, shortDescription: 'Announced edition' })
    closed = await aClosedEdition({ name: 'Closed', year: 2025, shortDescription: 'Closed edition' })
    published = await aPublishedEdition({ name: 'Published', year: 2024, shortDescription: 'Published edition' })
  })

  describe('UC-002 · visibility', () => {
    it('UC-002 · guest sees announced, closed and published editions, each with its state', async () => {
      const res = await asGuest().get('/editions')

      expect(res.status).toBe(200)
      expect(res.body).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: announced.id, state: 'ACTIVE' }),
        expect.objectContaining({ id: closed.id, state: 'CLOSED' }),
        expect.objectContaining({ id: published.id, state: 'PUBLISHED' })
      ]))
    })

    it('UC-002 · guest never sees not-announced editions', async () => {
      const res = await asGuest().get('/editions')

      expect(res.status).toBe(200)
      expect(idsOf(res.body)).not.toContain(notAnnounced.id)
      expect(idsOf(res.body)).not.toContain(incompleteNotAnnounced.id)
      expect(statesOf(res.body)).not.toContain('PLANNED')
    })

    it('UC-002 · participant sees exactly the same editions as a guest', async () => {
      const api = await as(participant(1))

      const participantRes = await api.get('/editions')
      const guestRes = await asGuest().get('/editions')

      expect(participantRes.status).toBe(200)
      expect(guestRes.status).toBe(200)
      expect(idsOf(participantRes.body).sort()).toEqual(idsOf(guestRes.body).sort())
    })

    it.each(STAFF_ROLES)('UC-002 · %s also sees not-announced editions without a filter', async (_role, staffMember) => {
      const api = await as(staffMember())

      const res = await api.get('/editions')

      expect(res.status).toBe(200)
      expect(res.body).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: notAnnounced.id, state: 'PLANNED' }),
        expect.objectContaining({ id: incompleteNotAnnounced.id, state: 'PLANNED' }),
        expect.objectContaining({ id: announced.id, state: 'ACTIVE' }),
        expect.objectContaining({ id: closed.id, state: 'CLOSED' }),
        expect.objectContaining({ id: published.id, state: 'PUBLISHED' })
      ]))
    })
  })

  describe('UC-002 · filter by state', () => {
    it('UC-002 · guest asking for not-announced editions gets 401', async () => {
      const res = await asGuest().get('/editions').query({ state: 'PLANNED' })

      expect(res.status).toBe(401)
    })

    it('UC-002 · participant asking for not-announced editions gets 403', async () => {
      const api = await as(participant(1))

      const res = await api.get('/editions').query({ state: 'PLANNED' })

      expect(res.status).toBe(403)
    })

    it.each(STAFF_ROLES)('UC-002 · %s asking for not-announced editions gets only not-announced editions', async (_role, staffMember) => {
      const api = await as(staffMember())

      const res = await api.get('/editions').query({ state: 'PLANNED' })

      expect(res.status).toBe(200)
      expect(idsOf(res.body)).toEqual(expect.arrayContaining([notAnnounced.id, incompleteNotAnnounced.id]))
      expect(idsOf(res.body)).not.toContain(announced.id)
      expect(idsOf(res.body)).not.toContain(closed.id)
      expect(idsOf(res.body)).not.toContain(published.id)
      expect(statesOf(res.body).filter((state) => state !== 'PLANNED')).toEqual([])
    })
  })

  describe('UC-002 · IRQ-005 · fields', () => {
    it('UC-002 · IRQ-005 · guest items have no field outside the public set', async () => {
      const res = await asGuest().get('/editions')

      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
      for (const item of res.body) {
        expect(fieldsOutsideAllowed(item)).toEqual([])
      }
    })

    it('UC-002 · IRQ-005 · guest items have every required field', async () => {
      const res = await asGuest().get('/editions')

      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
      for (const item of res.body) {
        expect(missingRequiredFields(item, REQUIRED_EDITION_LIST_FIELDS)).toEqual([])
      }
    })

    it('UC-002 · IRQ-005 · participant items have no field outside the public set, so no driveLink', async () => {
      const api = await as(participant(1))

      const res = await api.get('/editions')

      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
      for (const item of res.body) {
        expect(fieldsOutsideAllowed(item)).toEqual([])
      }
    })

    it('UC-002 · IRQ-005 · participant items have every required field', async () => {
      const api = await as(participant(1))

      const res = await api.get('/editions')

      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
      for (const item of res.body) {
        expect(missingRequiredFields(item, REQUIRED_EDITION_LIST_FIELDS)).toEqual([])
      }
    })

    it.each(STAFF_ROLES)('UC-002 · IRQ-005 · %s items have no field outside the public set plus driveLink', async (_role, staffMember) => {
      const api = await as(staffMember())

      const res = await api.get('/editions')

      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
      for (const item of res.body) {
        expect(fieldsOutsideAllowed(item, ALLOWED_STAFF_EDITION_LIST_FIELDS)).toEqual([])
      }
    })

    it.each(STAFF_ROLES)('UC-002 · IRQ-005 · %s items have every required field and driveLink', async (_role, staffMember) => {
      const api = await as(staffMember())

      const res = await api.get('/editions')

      expect(res.status).toBe(200)
      expect(res.body.length).toBeGreaterThan(0)
      for (const item of res.body) {
        expect(missingRequiredFields(item, requiredStaffFieldsOf(item))).toEqual([])
      }
    })

    it('UC-002 · IRQ-005 · name, year and short description are the edition\'s own', async () => {
      const res = await asGuest().get('/editions')

      expect(res.status).toBe(200)
      for (const created of [announced, closed, published]) {
        const listed = res.body.find((edition) => edition.id === created.id)
        expect(listed).toMatchObject({
          name: created.name,
          year: created.year,
          shortDescription: created.shortDescription
        })
      }
    })

    it('UC-002 · IRQ-005 · logo is a link', async () => {
      const res = await asGuest().get('/editions')

      expect(res.status).toBe(200)
      for (const created of [announced, closed, published]) {
        const listed = res.body.find((edition) => edition.id === created.id)
        expect(listed.logo).toMatch(LINK)
      }
    })

    it.each(STAFF_ROLES)('UC-002 · BRU-004 · %s sees a not-announced edition without short description or logo listed', async (_role, staffMember) => {
      const api = await as(staffMember())

      const res = await api.get('/editions')

      expect(res.status).toBe(200)
      expect(idsOf(res.body)).toContain(incompleteNotAnnounced.id)
    })

    it.each(STAFF_ROLES)('UC-002 · BRU-004 · %s sees the missing short description and logo absent or null', async (_role, staffMember) => {
      const api = await as(staffMember())

      const res = await api.get('/editions')

      expect(res.status).toBe(200)
      const listed = res.body.find((edition) => edition.id === incompleteNotAnnounced.id)
      expect(listed).toBeDefined()
      expect(listed.shortDescription ?? null).toBeNull()
      expect(listed.logo ?? null).toBeNull()
    })
  })
})
