import { stateSharedWithApp } from '../native.js'

export const outbox = stateSharedWithApp('outbox', () => [])

export const undelivered = stateSharedWithApp('undeliveredEmails', () => [])

const copyOf = (email) => ({ ...email, to: [...email.to] })

export const sentEmails = () => outbox.map(copyOf)

export const undeliveredEmails = () => undelivered.map(copyOf)

export const clearOutbox = () => {
  outbox.length = 0
  undelivered.length = 0
}
