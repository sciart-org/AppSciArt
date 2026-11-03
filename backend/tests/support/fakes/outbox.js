import { stateSharedWithApp } from '../native.js'

export const outbox = stateSharedWithApp('outbox', () => [])

export const sentEmails = () => outbox.map(email => ({ ...email, to: [...email.to] }))

export const clearOutbox = () => { outbox.length = 0 }
