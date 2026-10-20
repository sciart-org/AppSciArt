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

const idsOf = (editions) => editions.map((edition) => edition.id)

const listedBy = async (api) => {
  const res = await api.get('/editions')
  expect(res.status).toBe(200)
  return res.body
}

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
  let notAnnounced, announced, closed, published

  beforeAll(async () => {
    notAnnounced = await aNotAnnouncedEdition()
    announced = await anAnnouncedEdition({ name: 'Announced', year: 2026, shortDescription: 'Announced edition' })
    closed = await aClosedEdition({ name: 'Closed', year: 2025, shortDescription: 'Closed edition' })
    published = await aPublishedEdition({ name: 'Published', year: 2024, shortDescription: 'Published edition' })
  })

  it('UC-002 · guest sees announced, closed and published editions in one list, each with its state', async () => {
    const editions = await listedBy(asGuest())

    expect(editions).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: announced.id, state: 'ACTIVE' }),
      expect.objectContaining({ id: closed.id, state: 'CLOSED' }),
      expect.objectContaining({ id: published.id, state: 'PUBLISHED' })
    ]))
  })

  it('UC-002 · guest does not see not-announced editions', async () => {
    const editions = await listedBy(asGuest())

    expect(idsOf(editions)).not.toContain(notAnnounced.id)
    expect(editions.map((edition) => edition.state)).not.toContain('PLANNED')
  })

  it('UC-002 · guest asking for not-announced editions is unauthorised', async () => {
    const res = await asGuest().get('/editions').query({ state: 'PLANNED' })

    expect(res.status).toBe(401)
  })

  it('UC-002 · participant asking for not-announced editions is forbidden', async () => {
    const api = await as(participant(1))

    const res = await api.get('/editions').query({ state: 'PLANNED' })

    expect(res.status).toBe(403)
  })

  it('UC-002 · participant sees the same editions as a guest', async () => {
    const api = await as(participant(1))

    const participantEditions = await listedBy(api)
    const guestEditions = await listedBy(asGuest())

    expect(idsOf(participantEditions).sort()).toEqual(idsOf(guestEditions).sort())
  })

  it.each([
    ['designer', () => designer(1)],
    ['facilitator', () => facilitator(1)],
    ['administrator', () => administrator(1)]
  ])('UC-002 · %s sees not-announced editions without a filter', async (_role, staffMember) => {
    const api = await as(staffMember())

    const editions = await listedBy(api)

    expect(editions).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: notAnnounced.id, state: 'PLANNED' }),
      expect.objectContaining({ id: announced.id }),
      expect.objectContaining({ id: closed.id }),
      expect.objectContaining({ id: published.id })
    ]))
  })

  it('UC-002 · each visible edition shows its name, year, short description and logo link', async () => {
    const editions = await listedBy(asGuest())

    for (const created of [announced, closed, published]) {
      const listed = editions.find((edition) => edition.id === created.id)
      expect(listed).toMatchObject({
        name: created.name,
        year: created.year,
        shortDescription: created.shortDescription,
        logo: expect.stringMatching(/^https?:\/\/\S+$/)
      })
    }
  })
})
