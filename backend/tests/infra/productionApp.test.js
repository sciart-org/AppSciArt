import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { asGuest, as, designer, productionApp, productionStartup } from '../support/index.js'

const FRONTEND_URL = 'https://frontend.example.org'
const UNREACHABLE_DATABASE_URL = 'postgres://nobody:nothing@127.0.0.1:1/nowhere'

describe('productionApp', () => {
  const environmentBefore = { ...process.env }
  let app

  beforeAll(async () => {
    app = await productionApp({ frontendUrl: FRONTEND_URL })
  })

  afterAll(() => app?.stop())

  it('starts an instance on its own local URL, separate from the testing app', async () => {
    const editions = await app.asGuest().get('/editions')

    expect(app.url).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/)
    expect(editions.status).toBe(200)
  })

  it('runs the instance with NODE_ENV=production and the given FRONTEND_URL', () => {
    expect(app.output()).toContain(`NODE_ENV=production, FRONTEND_URL=${FRONTEND_URL}`)
  })

  it('makes the instance use the fake Google and Resend', () => {
    expect(app.output()).toContain('fake Google and Resend in place')
  })

  it('logs users in against the instance with as(user)', async () => {
    const api = await app.as(designer(1))

    expect((await api.get('/editions')).status).toBe(200)
  })

  it('leaves the environment of the tests and the testing app untouched', async () => {
    expect(process.env).toEqual(environmentBefore)
    expect((await asGuest().get('/editions')).status).toBe(200)
    expect((await (await as(designer(1))).get('/editions')).status).toBe(200)
  })
})

describe('productionApp stop()', () => {
  it('ends the instance, so its URL no longer answers', async () => {
    const app = await productionApp()

    await app.stop()

    await expect(app.asGuest().get('/editions')).rejects.toThrow()
  })
})

describe('productionStartup', () => {
  it('reports started: true when the server starts listening', async () => {
    const startup = await productionStartup()

    expect(startup.started).toBe(true)
    expect(startup.output).toContain('NODE_ENV=production')
  })

  it('starts the server without FRONTEND_URL when frontendUrl is null', async () => {
    const startup = await productionStartup({ frontendUrl: null })

    expect(startup.output).toContain('FRONTEND_URL=(unset)')
  })

  it('reports started: false, the exit code and the output when the server exits during startup', async () => {
    const startup = await productionStartup({ env: { DATABASE_URL: UNREACHABLE_DATABASE_URL } })

    expect(startup.started).toBe(false)
    expect(startup.exitCode).toEqual(expect.any(Number))
    expect(startup.output).toContain('ECONNREFUSED')
  })
})
