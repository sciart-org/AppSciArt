import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { asGuest, productionApp } from '../support/index.js'

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
