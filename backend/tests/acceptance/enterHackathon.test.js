import { describe, it, expect } from 'vitest'
import {
  as,
  administrator,
  designer,
  facilitator,
  participant,
  anAnnouncedEdition,
  aScientistOf,
  aNotAnnouncedHackathon,
  anAnnouncedHackathon,
  aClosedHackathon,
  anOngoingHackathonAt,
  anEndedHackathon,
  socketAs,
  nextEvent,
  noEventArrives,
  serverCrashes
} from '../support/index.js'

const PARTICIPANT_UPDATES = 'ALL'

const MANAGEMENT_UPDATES = 'STAFF'

const NONEXISTENT_HACKATHON_ID = '00000000-0000-4000-8000-000000000000'

const JOIN_ANSWER_TIMEOUT_MS = 2000

const ABSENCE_WAIT_MS = 1000

let updateCount = 0

const updater = () => facilitator(15)

const sendUpdate = async (hackathon, broadcast) => {
  updateCount += 1
  const api = await as(updater())
  const res = await api
    .put(`/hackathons/${hackathon.id}`)
    .query({ broadcast })
    .send({ location: `Granada ${updateCount}` })
  return res.status
}

const updateArrival = (socket) =>
  nextEvent(socket, 'hackathon:updated').then(() => 'received', () => 'not received')

const updateAbsence = (socket) =>
  noEventArrives(socket, 'hackathon:updated', ABSENCE_WAIT_MS).then((absent) => (absent ? 'not received' : 'received'))

const outcomeOfUpdate = async (socket, hackathon, broadcast, watch) => {
  const event = watch(socket)
  const updateStatus = await sendUpdate(hackathon, broadcast)
  return { updateStatus, event: await event }
}

const receivesUpdate = (socket, hackathon, broadcast) =>
  outcomeOfUpdate(socket, hackathon, broadcast, updateArrival)

const missesUpdate = (socket, hackathon, broadcast) =>
  outcomeOfUpdate(socket, hackathon, broadcast, updateAbsence)

const detailOf = (error) =>
  ['string', 'number'].includes(typeof error?.description) ? ` (${error.description})` : ''

const connectAs = (user, options) =>
  socketAs(user, options).catch((error) => {
    throw new Error(`real-time connection refused, expected it accepted: ${error?.message ?? error}${detailOf(error)}`)
  })

const emitJoin = (socket, ...value) =>
  socket.timeout(JOIN_ANSWER_TIMEOUT_MS).emitWithAck('join_hackathon_rooms', ...value).catch(() => undefined)

const errorMessageTypeOn = async (socket, send) => {
  const errorMessage = nextEvent(socket, 'error_message').then((message) => message, () => undefined)
  await send(socket)
  return { errorMessage: typeof (await errorMessage) }
}

const joinAndWatchRefusal = async (user, value) => {
  const socket = await connectAs(user)
  return errorMessageTypeOn(socket, (s) => emitJoin(s, value))
}

const REFUSAL = { errorMessage: 'string' }

const RECEIVED = { updateStatus: 200, event: 'received' }

const NOT_RECEIVED = { updateStatus: 200, event: 'not received' }

const STAFF_MEMBERS = [
  ['a facilitator', () => facilitator(1)],
  ['a designer', () => designer(1)],
  ['an administrator', () => administrator(1)]
]

const MALFORMED_JOINS = [
  ['a value that is not an id', (socket) => emitJoin(socket, 'not-an-id')],
  ['no value', (socket) => emitJoin(socket)],
  ['a number', (socket) => emitJoin(socket, 42)]
]

describe('UC-047 · BRU-048 · who joins an ongoing hackathon', () => {
  it('UC-047 · BRU-048 · an enrolled participant who is not assisting joins and receives the participant updates', async () => {
    const user = participant(1)
    const hackathon = await aClosedHackathon({ participants: [user] })
    const socket = await connectAs(user, { hackathon })

    const outcome = await receivesUpdate(socket, hackathon, PARTICIPANT_UPDATES)

    expect(outcome).toEqual(RECEIVED)
  })

  it('UC-047 · BRU-048 · an enrolled, assisting participant joins and receives the participant updates', async () => {
    const user = participant(2)
    const hackathon = await aClosedHackathon({ assisting: [user] })
    const socket = await connectAs(user, { hackathon })

    const outcome = await receivesUpdate(socket, hackathon, PARTICIPANT_UPDATES)

    expect(outcome).toEqual(RECEIVED)
  })

  it('UC-047 · BRU-048 · an enrolled participant does not receive the management updates', async () => {
    const user = participant(3)
    const hackathon = await aClosedHackathon({ participants: [user] })
    const socket = await connectAs(user, { hackathon })

    const outcome = await missesUpdate(socket, hackathon, MANAGEMENT_UPDATES)

    expect(outcome).toEqual(NOT_RECEIVED)
  })

  it('UC-047 · BRU-048 · BRU-025 · an evaluator of the hackathon joins and receives the management updates', async () => {
    const evaluator = participant(4)
    const hackathon = await aClosedHackathon({ evaluators: [evaluator] })
    const socket = await connectAs(evaluator, { hackathon })

    const outcome = await receivesUpdate(socket, hackathon, MANAGEMENT_UPDATES)

    expect(outcome).toEqual(RECEIVED)
  })

  it.each(STAFF_MEMBERS)('UC-047 · BRU-048 · %s joins and receives the management updates', async (_role, staffMember) => {
    const hackathon = await aClosedHackathon()
    const socket = await connectAs(staffMember(), { hackathon })

    const outcome = await receivesUpdate(socket, hackathon, MANAGEMENT_UPDATES)

    expect(outcome).toEqual(RECEIVED)
  })
})

describe('UC-047 · BRU-048 · who is refused', () => {
  it('UC-047 · BRU-048 · a registered user who is not enrolled gets an error message', async () => {
    const hackathon = await aClosedHackathon({ participants: [participant(1)] })

    const outcome = await joinAndWatchRefusal(participant(5), hackathon.id)

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-047 · BRU-048 · a registered user who is not enrolled receives no participant updates', async () => {
    const hackathon = await aClosedHackathon({ participants: [participant(1)] })
    const socket = await connectAs(participant(5), { hackathon })

    const outcome = await missesUpdate(socket, hackathon, PARTICIPANT_UPDATES)

    expect(outcome).toEqual(NOT_RECEIVED)
  })

  it('UC-047 · BRU-048 · an inspiring scientist of the edition who is not enrolled gets an error message', async () => {
    const edition = await anAnnouncedEdition()
    const scientist = await aScientistOf(edition, participant(6))
    const hackathon = await aClosedHackathon({ edition })

    const outcome = await joinAndWatchRefusal(scientist, hackathon.id)

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-047 · BRU-048 · an inspiring scientist of the edition who is not enrolled receives no participant updates', async () => {
    const edition = await anAnnouncedEdition()
    const scientist = await aScientistOf(edition, participant(7))
    const hackathon = await aClosedHackathon({ edition })
    const socket = await connectAs(scientist, { hackathon })

    const outcome = await missesUpdate(socket, hackathon, PARTICIPANT_UPDATES)

    expect(outcome).toEqual(NOT_RECEIVED)
  })

  it('UC-047 · BRU-048 · an evaluator of another hackathon gets an error message', async () => {
    const evaluator = participant(8)
    await aClosedHackathon({ evaluators: [evaluator] })
    const hackathon = await aClosedHackathon()

    const outcome = await joinAndWatchRefusal(evaluator, hackathon.id)

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-047 · BRU-048 · an evaluator of another hackathon receives no participant updates of this one', async () => {
    const evaluator = participant(9)
    await aClosedHackathon({ evaluators: [evaluator] })
    const hackathon = await aClosedHackathon()
    const socket = await connectAs(evaluator, { hackathon })

    const outcome = await missesUpdate(socket, hackathon, PARTICIPANT_UPDATES)

    expect(outcome).toEqual(NOT_RECEIVED)
  })

  it('UC-047 · BRU-048 · an evaluator of another hackathon receives no management updates of this one', async () => {
    const evaluator = participant(10)
    await aClosedHackathon({ evaluators: [evaluator] })
    const hackathon = await aClosedHackathon()
    const socket = await connectAs(evaluator, { hackathon })

    const outcome = await missesUpdate(socket, hackathon, MANAGEMENT_UPDATES)

    expect(outcome).toEqual(NOT_RECEIVED)
  })
})

describe('UC-047 · when the hackathon can be joined', () => {
  it.each([
    ['PREPARING', (user) => aClosedHackathon({ participants: [user] })],
    ['TEAM_WORK', (user) => anOngoingHackathonAt('TEAM_WORK', { participants: [user] })]
  ])('UC-047 · an enrolled participant joins an ongoing hackathon in %s and receives the participant updates', async (_phase, ongoingHackathon) => {
    const user = participant(11)
    const hackathon = await ongoingHackathon(user)
    const socket = await connectAs(user, { hackathon })

    const outcome = await receivesUpdate(socket, hackathon, PARTICIPANT_UPDATES)

    expect(outcome).toEqual(RECEIVED)
  })

  it.each([
    ['a not announced', () => aNotAnnouncedHackathon()],
    ['an announced', () => anAnnouncedHackathon()],
    ['an ended', () => anEndedHackathon()]
  ])('UC-047 · BRU-048 · a facilitator gets an error message joining %s hackathon', async (_state, hackathonNotOngoing) => {
    const hackathon = await hackathonNotOngoing()

    const outcome = await joinAndWatchRefusal(facilitator(2), hackathon.id)

    expect(outcome).toEqual(REFUSAL)
  })

  it.each([
    ['an announced', (user) => anAnnouncedHackathon({ participants: [user] })],
    ['an ended', (user) => anEndedHackathon({ participants: [user] })]
  ])('UC-047 · an enrolled participant gets an error message joining %s hackathon', async (_state, hackathonNotOngoing) => {
    const user = participant(12)
    const hackathon = await hackathonNotOngoing(user)

    const outcome = await joinAndWatchRefusal(user, hackathon.id)

    expect(outcome).toEqual(REFUSAL)
  })
})

describe('UC-047 · bad join requests', () => {
  it.each(MALFORMED_JOINS)('UC-047 · a join with %s gets an error message', async (_value, sendMalformedJoin) => {
    const user = participant(13)
    await aClosedHackathon({ participants: [user] })
    const socket = await connectAs(user)

    const outcome = await errorMessageTypeOn(socket, sendMalformedJoin)

    expect(outcome).toEqual(REFUSAL)
  })

  it.each(MALFORMED_JOINS)('UC-047 · a join with %s does not crash the server', async (_value, sendMalformedJoin) => {
    const user = participant(13)
    await aClosedHackathon({ participants: [user] })
    const socket = await connectAs(user)

    await sendMalformedJoin(socket)

    expect(await serverCrashes()).toEqual([])
  })

  it('UC-047 · after a malformed join, the same socket joins the hackathon and receives its participant updates', async () => {
    const user = participant(14)
    const hackathon = await aClosedHackathon({ participants: [user] })
    const socket = await connectAs(user)
    await emitJoin(socket, 'not-an-id')

    await emitJoin(socket, hackathon.id)
    const outcome = await receivesUpdate(socket, hackathon, PARTICIPANT_UPDATES)

    expect(outcome).toEqual(RECEIVED)
  })

  it('UC-047 · a join with the id of a hackathon that does not exist gets an error message', async () => {
    const outcome = await joinAndWatchRefusal(facilitator(3), NONEXISTENT_HACKATHON_ID)

    expect(outcome).toEqual(REFUSAL)
  })
})
