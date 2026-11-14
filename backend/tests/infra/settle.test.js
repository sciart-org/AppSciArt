import { describe, expect, it } from 'vitest'
import { importFromSrc } from '../support/native.js'
import { Resend } from '../support/fakes/resend.js'
import { sentEmails, settle } from '../support/index.js'

const appSequelize = async () => (await importFromSrc('config/sequelize.js')).sequelize

const SLOW_QUERY = 'SELECT pg_sleep(0.3)'

describe('settle', () => {
  it("waits for a database query the app's Sequelize is still running", async () => {
    const sequelize = await appSequelize()
    let queryFinished = false
    sequelize.query(SLOW_QUERY).then(() => { queryFinished = true })

    await settle()

    expect(queryFinished).toBe(true)
  })

  it('waits for an email sent after a query finishes, like after-commit work', async () => {
    const sequelize = await appSequelize()
    sequelize.query(SLOW_QUERY).then(() =>
      new Resend('re_fake_test_key').emails.send({ to: 'after.commit@example.org', subject: 'After commit', html: '' })
    )

    await settle()

    expect(sentEmails()).toContainEqual(expect.objectContaining({ to: ['after.commit@example.org'] }))
  })

  it('resolves well before its timeout when the app has nothing running', async () => {
    const startedAt = Date.now()

    await expect(settle()).resolves.toBeUndefined()

    expect(Date.now() - startedAt).toBeLessThan(2000)
  })

  it('rejects when the app is still busy after the timeout', async () => {
    const sequelize = await appSequelize()
    const slowQuery = sequelize.query(SLOW_QUERY)

    await expect(settle({ timeout: 50 })).rejects.toThrow(/still busy after 50 ms/)

    await slowQuery
  })
})
