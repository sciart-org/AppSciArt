import { EventEmitter } from 'events'
import { describe, expect, it } from 'vitest'
import { socketAs, nextEvent, noEventArrives, participant } from '../support/index.js'

describe('socket client', () => {
  it('socketAs(user) connects to the running app with that user\'s token', async () => {
    const socket = await socketAs(participant(1))

    expect(socket.connected).toBe(true)
  })
})

describe('socket event helpers', () => {
  it('nextEvent resolves with the payload of the next event', async () => {
    const socket = new EventEmitter()
    const received = nextEvent(socket, 'presenting_group')

    socket.emit('presenting_group', { groupId: 'g1' })

    expect(await received).toEqual({ groupId: 'g1' })
  })

  it('nextEvent resolves with every argument when the event carries several', async () => {
    const socket = new EventEmitter()
    const received = nextEvent(socket, 'map_update')

    socket.emit('map_update', 'room-1', { nodes: [] })

    expect(await received).toEqual(['room-1', { nodes: [] }])
  })

  it('nextEvent rejects when the event does not arrive in time', async () => {
    const socket = new EventEmitter()

    await expect(nextEvent(socket, 'never_sent', 50)).rejects.toThrow('No "never_sent" event within 50 ms')
  })

  it('noEventArrives is true when the event does not arrive in time', async () => {
    const socket = new EventEmitter()

    expect(await noEventArrives(socket, 'never_sent', 50)).toBe(true)
  })

  it('noEventArrives is false when the event arrives in time', async () => {
    const socket = new EventEmitter()
    const silence = noEventArrives(socket, 'sent', 200)

    socket.emit('sent')

    expect(await silence).toBe(false)
  })
})
