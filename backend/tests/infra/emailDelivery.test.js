import { describe, expect, it } from 'vitest'
import { importFromSrc } from '../support/native.js'
import { Resend } from '../support/fakes/resend.js'
import {
  clearOutbox, failEmailDelivery, restoreEmailDelivery, sentEmails, settle, undeliveredEmails
} from '../support/index.js'

const send = (to) => new Resend('re_fake_test_key').emails.send({ to, subject: `To ${to}`, html: '<p>Hi</p>' })

const recipientsOf = (emails) => emails.flatMap(email => email.to)

describe('email delivery', () => {
  it('delivers by default and answers like the real SDK on success', async () => {
    clearOutbox()

    const result = await send('ok@example.org')

    expect(result).toEqual({ data: { id: expect.any(String) }, error: null })
    expect(recipientsOf(sentEmails())).toEqual(['ok@example.org'])
    expect(undeliveredEmails()).toEqual([])
  })

  it('failEmailDelivery() fails every send and answers like the real SDK on an outage', async () => {
    clearOutbox()
    failEmailDelivery()

    const results = [await send('a@example.org'), await send('b@example.org')]

    expect(results).toEqual([
      { data: null, error: { name: 'application_error', statusCode: 500, message: expect.any(String) } },
      { data: null, error: { name: 'application_error', statusCode: 500, message: expect.any(String) } }
    ])
    expect(sentEmails()).toEqual([])
    expect(recipientsOf(undeliveredEmails())).toEqual(['a@example.org', 'b@example.org'])
  })

  it('failEmailDelivery({ times }) fails only that many of the next sends', async () => {
    clearOutbox()
    failEmailDelivery({ times: 1 })

    await send('first@example.org')
    await send('second@example.org')

    expect(recipientsOf(undeliveredEmails())).toEqual(['first@example.org'])
    expect(recipientsOf(sentEmails())).toEqual(['second@example.org'])
  })

  it('restoreEmailDelivery() makes the next sends succeed again', async () => {
    clearOutbox()
    failEmailDelivery()
    restoreEmailDelivery()

    await send('back@example.org')

    expect(recipientsOf(sentEmails())).toEqual(['back@example.org'])
  })

  it("reaches the app's own email client", async () => {
    clearOutbox()
    failEmailDelivery()
    const { sendEmail } = await importFromSrc('emails/resend.js')

    await Promise.allSettled([sendEmail({ recipient: 'app@example.org', subject: 'From the app', html: '' })])
    await settle()

    expect(recipientsOf(undeliveredEmails())).toEqual(['app@example.org'])
    expect(sentEmails()).toEqual([])
  })

  it('delivery works again in the next test without restoring it by hand', async () => {
    clearOutbox()

    await send('next.test@example.org')

    expect(recipientsOf(sentEmails())).toEqual(['next.test@example.org'])
  })

  it('clearOutbox() also empties the undelivered emails', async () => {
    failEmailDelivery()
    await send('gone@example.org')

    clearOutbox()

    expect(undeliveredEmails()).toEqual([])
  })
})
