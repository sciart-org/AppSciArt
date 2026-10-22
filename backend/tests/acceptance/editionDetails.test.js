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

const ALLOWED_EDITION_DETAILS_FIELDS = ['id', 'state', 'name', 'year', 'logo', 'shortDescription', 'longDescription', 'catalogLink']

const ALLOWED_STAFF_EDITION_DETAILS_FIELDS = [...ALLOWED_EDITION_DETAILS_FIELDS, 'driveLink']

const UNKNOWN_EDITION_ID = '00000000-0000-4000-8000-000000000000'

const A_LINK = /^https?:\/\/\S+$/

const fieldsOutsideAllowed = (item, allowed = ALLOWED_EDITION_DETAILS_FIELDS) =>
  Object.keys(item).filter((key) => !allowed.includes(key))

const publicValuesOf = (edition) => ({
  id: edition.id,
  state: edition.state,
  name: edition.name,
  year: edition.year,
  shortDescription: edition.shortDescription,
  longDescription: edition.longDescription
})

const detailsOf = (api, edition) => api.get(`/editions/${edition.id}`)

describe('UC-003 · view the details of an edition', () => {
  let notAnnounced, announced, closed, published

  beforeAll(async () => {
    notAnnounced = await aNotAnnouncedEdition()
    announced = await anAnnouncedEdition()
    closed = await aClosedEdition()
    published = await aPublishedEdition()
  })

  it.each([
    ['an announced', () => announced],
    ['a closed', () => closed]
  ])('UC-003 · guest gets the full description of %s edition', async (_state, editionOf) => {
    const edition = editionOf()

    const res = await detailsOf(asGuest(), edition)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ ...publicValuesOf(edition), logo: expect.stringMatching(A_LINK) })
    expect(fieldsOutsideAllowed(res.body)).toEqual([])
  })

  it('UC-003 · guest gets the full description and the catalogue of a published edition', async () => {
    const res = await detailsOf(asGuest(), published)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      ...publicValuesOf(published),
      logo: expect.stringMatching(A_LINK),
      catalogLink: published.catalogLink
    })
    expect(fieldsOutsideAllowed(res.body)).toEqual([])
  })

  it('UC-003 · participant gets the same details as a guest', async () => {
    const api = await as(participant(1))

    const participantRes = await detailsOf(api, announced)
    const guestRes = await detailsOf(asGuest(), announced)

    expect(participantRes.status).toBe(200)
    expect(participantRes.body).toEqual(guestRes.body)
    expect(fieldsOutsideAllowed(participantRes.body)).toEqual([])
  })

  it('UC-003 · guest asking for a not-announced edition gets not found', async () => {
    const res = await detailsOf(asGuest(), notAnnounced)

    expect(res.status).toBe(404)
  })

  it('UC-003 · participant asking for a not-announced edition gets not found', async () => {
    const api = await as(participant(1))

    const res = await detailsOf(api, notAnnounced)

    expect(res.status).toBe(404)
  })

  it.each([
    ['designer', () => designer(1)],
    ['facilitator', () => facilitator(1)],
    ['administrator', () => administrator(1)]
  ])('UC-003 · %s gets a not-announced edition with its Drive folder link', async (_role, staffMember) => {
    const api = await as(staffMember())

    const res = await detailsOf(api, notAnnounced)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      id: notAnnounced.id,
      state: 'PLANNED',
      name: notAnnounced.name,
      year: notAnnounced.year,
      driveLink: expect.stringMatching(A_LINK)
    })
    expect(fieldsOutsideAllowed(res.body, ALLOWED_STAFF_EDITION_DETAILS_FIELDS)).toEqual([])
  })

  it('UC-003 · staff get every public field of a visible edition plus its Drive folder link', async () => {
    const api = await as(designer(1))

    const res = await detailsOf(api, published)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      ...publicValuesOf(published),
      logo: expect.stringMatching(A_LINK),
      catalogLink: published.catalogLink,
      driveLink: expect.stringMatching(A_LINK)
    })
    expect(fieldsOutsideAllowed(res.body, ALLOWED_STAFF_EDITION_DETAILS_FIELDS)).toEqual([])
  })

  it.each([
    ['guest', async () => asGuest()],
    ['participant', () => as(participant(1))],
    ['designer', () => as(designer(1))]
  ])('UC-003 · %s asking for an unknown edition gets not found', async (_actor, clientOf) => {
    const api = await clientOf()

    const res = await api.get(`/editions/${UNKNOWN_EDITION_ID}`)

    expect(res.status).toBe(404)
  })
})
