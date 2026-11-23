import { describe, expect, it } from 'vitest'
import { serverCrashes } from '../support/index.js'
import { failIfServerCrashedUnnoticed } from '../support/crashes.js'

const rejectWithNobodyListening = (message) => { Promise.reject(new Error(message)) }

const throwOutsideAnyAwait = (message) => setImmediate(() => { throw new TypeError(message) })

describe('serverCrashes', () => {
  it('is empty when nothing went wrong', async () => {
    expect(await serverCrashes()).toEqual([])
  })

  it('records a promise rejection nobody handled', async () => {
    rejectWithNobodyListening('email send failed')

    expect(await serverCrashes()).toEqual([{ kind: 'unhandled rejection', message: 'Error: email send failed' }])
  })

  it('records an exception thrown outside any request', async () => {
    throwOutsideAnyAwait('broadcast failed')

    expect(await serverCrashes()).toEqual([{ kind: 'uncaught exception', message: 'TypeError: broadcast failed' }])
  })

  it('starts empty in each test, so crashes of an earlier test do not leak', async () => {
    expect(await serverCrashes()).toEqual([])
  })

  it('a crash the test never looked at makes the test fail', async () => {
    rejectWithNobodyListening('nobody checked')
    await new Promise(resolve => setImmediate(resolve))

    expect(() => failIfServerCrashedUnnoticed()).toThrow(/server crashed during this test[\s\S]*nobody checked/)

    await serverCrashes()
  })

  it('a crash the test looked at with serverCrashes() does not fail it again', async () => {
    rejectWithNobodyListening('checked')
    await serverCrashes()

    expect(() => failIfServerCrashedUnnoticed()).not.toThrow()
  })
})
