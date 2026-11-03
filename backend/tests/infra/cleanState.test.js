import { beforeAll, describe, expect, it } from 'vitest'
import { anAnnouncedEdition, facilitator, participant, sentEmails, driveFiles } from '../support/index.js'
import { startFromCleanState } from '../support/state.js'
import { outbox } from '../support/fakes/outbox.js'
import {
  createUnregisteredProfile, editionCount, isFacilitator, makeFacilitator, removeFacilitatorRole, userProfileCount
} from './database.js'

const BASE_USER_COUNT = 60

describe('a test file starts from a clean state', () => {
  let promotedParticipant
  let demotedFacilitator

  beforeAll(async () => {
    promotedParticipant = participant(1)
    demotedFacilitator = facilitator(1)
    await anAnnouncedEdition()
    await createUnregisteredProfile('created.by.a.test@example.org')
    await makeFacilitator(promotedParticipant)
    await removeFacilitatorRole(demotedFacilitator)
    outbox.push({ to: ['someone@example.org'], subject: 'Sent during a test' })

    await startFromCleanState()
  })

  it('no domain data is left in the database', async () => {
    expect(await editionCount()).toBe(0)
  })

  it('only the base users remain', async () => {
    expect(await userProfileCount()).toBe(BASE_USER_COUNT)
  })

  it('base users get back exactly their seeded staff roles', async () => {
    expect(await isFacilitator(promotedParticipant)).toBe(false)
    expect(await isFacilitator(demotedFacilitator)).toBe(true)
  })

  it('the fake Drive is empty', () => {
    expect(driveFiles()).toEqual([])
  })

  it('the email outbox is empty', () => {
    expect(sentEmails()).toEqual([])
  })
})
