import { describe, it, expect } from 'vitest'
import {
  asGuest,
  sentEmails,
  undeliveredEmails,
  failEmailDelivery,
  settle,
  serverCrashes
} from '../support/index.js'

const quickRegister = (email) =>
  asGuest().post('/register').query({ method: 'quick' }).send({ email })

const recipientsOfEmailsTo = (emails, address) =>
  emails.filter((email) => email.to.includes(address)).map((email) => email.to)

describe('GRQ-003 · NFRQ-013 · email delivered', () => {
  it('GRQ-003 · NFRQ-013 · UC-005 · guest quick registration answers 201 when the email is delivered', async () => {
    const address = 'delivered.status@example.org'

    const res = await quickRegister(address)
    await settle()

    expect({ status: res.status }).toEqual({ status: 201 })
    expect(await serverCrashes()).toEqual([])
  })

  it('GRQ-003 · NFRQ-013 · UC-005 · guest quick registration sends one email to the registered address', async () => {
    const address = 'delivered.email@example.org'

    await quickRegister(address)
    await settle()

    expect(recipientsOfEmailsTo(sentEmails(), address)).toEqual([[address]])
    expect(await serverCrashes()).toEqual([])
  })

  it('GRQ-003 · NFRQ-013 · the server keeps running after sending a delivered email', async () => {
    const address = 'delivered.crashes@example.org'

    await quickRegister(address)

    expect(await serverCrashes()).toEqual([])
  })
})

describe('GRQ-003 · NFRQ-013 · email service down', () => {
  it('GRQ-003 · NFRQ-013 · UC-005 · guest quick registration still answers 201 when the email service is down', async () => {
    const address = 'down.status@example.org'
    failEmailDelivery()

    const res = await quickRegister(address)
    await settle()

    expect({ status: res.status }).toEqual({ status: 201 })
    expect(await serverCrashes()).toEqual([])
  })

  it('GRQ-003 · NFRQ-013 · UC-005 · the email to the registered address is not delivered when the email service is down', async () => {
    const address = 'down.undelivered@example.org'
    failEmailDelivery()

    await quickRegister(address)
    await settle()

    expect(recipientsOfEmailsTo(undeliveredEmails(), address)).toEqual([[address]])
    expect(await serverCrashes()).toEqual([])
  })

  it('GRQ-003 · NFRQ-013 · UC-005 · no email is sent to the registered address when the email service is down', async () => {
    const address = 'down.notsent@example.org'
    failEmailDelivery()

    await quickRegister(address)
    await settle()

    expect(recipientsOfEmailsTo(sentEmails(), address)).toEqual([])
    expect(await serverCrashes()).toEqual([])
  })

  it('GRQ-003 · NFRQ-013 · the server keeps running when the email service is down', async () => {
    const address = 'down.crashes@example.org'
    failEmailDelivery()

    await quickRegister(address)

    expect(await serverCrashes()).toEqual([])
  })
})
