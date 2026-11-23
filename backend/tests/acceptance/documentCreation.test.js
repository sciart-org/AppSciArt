import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import {
  asGuest,
  as,
  designer,
  anEdition,
  driveFiles,
  revokeDriveAccess,
  restoreDriveAccess,
  productionApp
} from '../support/index.js'

const EDITION_YEAR = 2026

const MENTIONS_DRIVE = 'Drive'

const ASKS_TO_REAUTHORISE = /re-?authori[sz]/i

const GENERIC_ERROR_MESSAGE = 'Internal Server Error'

const namesOf = (editions) => editions.map((edition) => edition.name)

const idsOf = (editions) => editions.map((edition) => edition.id)

const countOf = async (files) => (await files).length

describe('GRQ-010 · NFRQ-015 · UC-029 · testing app with its Drive access expired', () => {
  afterEach(() => {
    restoreDriveAccess()
  })

  it('GRQ-010 · NFRQ-015 · UC-029 · designer creating an edition gets 503, not 401 or 403', async () => {
    const api = await as(designer(1))
    revokeDriveAccess()

    const res = await api.post('/editions').send({ name: 'Drive expired status', year: EDITION_YEAR })

    expect(res.status).toBe(503)
  })

  it('GRQ-010 · NFRQ-015 · UC-029 · designer creating an edition is told Google Drive access must be re-authorised', async () => {
    const api = await as(designer(1))
    revokeDriveAccess()

    const res = await api.post('/editions').send({ name: 'Drive expired message', year: EDITION_YEAR })

    expect({ error: res.body.error }).toEqual({ error: expect.stringContaining(MENTIONS_DRIVE) })
    expect({ error: res.body.error }).toEqual({ error: expect.stringMatching(ASKS_TO_REAUTHORISE) })
  })

  it('GRQ-010 · UC-029 · the edition refused for expired Drive access is not listed to the designer', async () => {
    const api = await as(designer(1))
    const name = 'Drive expired not listed'
    revokeDriveAccess()

    await api.post('/editions').send({ name, year: EDITION_YEAR })

    restoreDriveAccess()
    const res = await api.get('/editions')
    expect(res.status).toBe(200)
    expect(namesOf(res.body)).not.toContain(name)
  })

  it('GRQ-010 · NFRQ-015 · the edition refused for expired Drive access leaves no new file in Drive', async () => {
    const api = await as(designer(1))
    const filesBefore = await countOf(driveFiles())
    revokeDriveAccess()

    await api.post('/editions').send({ name: 'Drive expired no file', year: EDITION_YEAR })

    expect({ files: await countOf(driveFiles()) }).toEqual({ files: filesBefore })
  })

  it('GRQ-010 · UC-029 · the designer\'s session still works after the refusal for expired Drive access', async () => {
    const api = await as(designer(1))
    revokeDriveAccess()
    await api.post('/editions').send({ name: 'Drive expired session', year: EDITION_YEAR })

    restoreDriveAccess()
    const res = await api.get('/editions')

    expect(res.status).toBe(200)
  })

  it('GRQ-010 · NFRQ-015 · guest still gets the edition list, with the announced edition in it', async () => {
    const announced = await anEdition({ state: 'ACTIVE', name: 'Announced with logo, list answers' })
    revokeDriveAccess()

    const res = await asGuest().get('/editions')

    expect(res.status).toBe(200)
    expect(idsOf(res.body)).toContain(announced.id)
  })

  it('GRQ-010 · NFRQ-015 · guest sees the announced edition\'s logo as null', async () => {
    const announced = await anEdition({ state: 'ACTIVE', name: 'Announced with logo, logo null' })
    revokeDriveAccess()

    const res = await asGuest().get('/editions')

    expect(res.status).toBe(200)
    const listed = res.body.find((edition) => edition.id === announced.id)
    expect({ listed: listed !== undefined, logo: listed?.logo }).toEqual({ listed: true, logo: null })
  })

  it('GRQ-010 · NFRQ-015 · UC-029 · designer creates an edition once Drive access works again', async () => {
    const api = await as(designer(1))
    revokeDriveAccess()
    restoreDriveAccess()

    const res = await api.post('/editions').send({ name: 'Drive restored', year: EDITION_YEAR })

    expect(res.status).toBe(201)
  })
})

describe('GRQ-010 · NFRQ-015 · UC-029 · production instance with its Drive access expired', () => {
  let app

  beforeAll(async () => {
    app = await productionApp({ driveAccess: 'revoked' })
  })

  afterAll(async () => {
    await app.stop()
  })

  it('GRQ-010 · NFRQ-015 · UC-029 · in production, designer creating an edition gets 503', async () => {
    const api = await app.as(designer(1))

    const res = await api.post('/editions').send({ name: 'Production Drive expired status', year: EDITION_YEAR })

    expect(res.status).toBe(503)
  })

  it('GRQ-010 · NFRQ-015 · UC-029 · in production, designer is told Google Drive access must be re-authorised', async () => {
    const api = await app.as(designer(1))

    const res = await api.post('/editions').send({ name: 'Production Drive expired message', year: EDITION_YEAR })

    expect({ error: res.body.error }).toEqual({ error: expect.stringContaining(MENTIONS_DRIVE) })
    expect({ error: res.body.error }).toEqual({ error: expect.stringMatching(ASKS_TO_REAUTHORISE) })
  })

  it('GRQ-010 · NFRQ-015 · UC-029 · in production, the refusal is not turned into the generic unexpected error', async () => {
    const api = await app.as(designer(1))

    const res = await api.post('/editions').send({ name: 'Production Drive expired not generic', year: EDITION_YEAR })

    expect({ errorId: res.body.errorId }).toEqual({ errorId: undefined })
    expect({ error: res.body.error }).not.toEqual({ error: GENERIC_ERROR_MESSAGE })
  })
})
