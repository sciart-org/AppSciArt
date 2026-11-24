import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { asGuest, productionApp } from '../support/index.js'
import { query } from '../support/db.js'

describe('cutting the database of a production instance', () => {
  let app

  beforeAll(async () => {
    app = await productionApp()
  })

  afterAll(() => app?.stop())

  it('cutDatabase() makes a request that needs the database fail with 500', async () => {
    app.cutDatabase()

    const editions = await app.asGuest().get('/editions')
    app.restoreDatabase()

    expect(editions.status).toBe(500)
  })

  it('restoreDatabase() lets the same request succeed again', async () => {
    app.cutDatabase()
    await app.asGuest().get('/editions')

    app.restoreDatabase()

    expect((await app.asGuest().get('/editions')).status).toBe(200)
  })

  it('does not affect the testing app', async () => {
    app.cutDatabase()

    const editions = await asGuest().get('/editions')
    app.restoreDatabase()

    expect(editions.status).toBe(200)
  })
})

const isPreRegistered = async (email) =>
  (await query('SELECT 1 FROM profiles.early_signups WHERE email = $1', [email])).rowCount === 1

describe('failing the next commit of a production instance', () => {
  let app

  const quickRegister = (email) => app.asGuest().post('/register').query({ method: 'quick' }).send({ email })

  beforeAll(async () => {
    app = await productionApp()
  })

  afterAll(() => app?.stop())

  it('failNextCommit() leaves the change of the next request unstored', async () => {
    const commitFailed = app.failNextCommit()

    await quickRegister('lost.commit@example.org')
    await commitFailed

    expect({ stored: await isPreRegistered('lost.commit@example.org') }).toEqual({ stored: false })
  })

  it('failNextCommit() fails only one commit: the request after it is stored', async () => {
    const commitFailed = app.failNextCommit()
    await quickRegister('lost.first@example.org')
    await commitFailed

    await quickRegister('kept.after@example.org')

    await expect.poll(() => isPreRegistered('kept.after@example.org')).toBe(true)
  })

  it('without failNextCommit() the change is stored', async () => {
    await quickRegister('kept.unarmed@example.org')

    await expect.poll(() => isPreRegistered('kept.unarmed@example.org')).toBe(true)
  })
})
