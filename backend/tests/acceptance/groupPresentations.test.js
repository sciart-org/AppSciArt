import { describe, it, expect } from 'vitest'
import {
  administrator,
  designer,
  facilitator,
  participant,
  anAnnouncedEdition,
  aPublishedSeed,
  anOngoingHackathonAt,
  aGroup,
  socketAs,
  nextEvent,
  noEventArrives,
  serverCrashes
} from '../support/index.js'

const ANSWER_TIMEOUT_MS = 2000

const ABSENCE_WAIT_MS = 1000

const FIRST_GROUP = 1

const SECOND_GROUP = 2

const REFUSAL = { errorMessage: 'string' }

const RECEIVED = 'received'

const NOT_RECEIVED = 'not received'

const assistingMember = () => participant(1)

const memberNotAssisting = () => participant(2)

const participantInNoGroup = () => participant(3)

const EVALUATORS = {
  receiving: () => participant(6),
  settingRefused: () => participant(7),
  settingUnheard: () => participant(8),
  settingUnchanged: () => participant(9),
  openingRefused: () => participant(10),
  openingUnheard: () => participant(11)
}

const participantElsewhere = () => participant(5)

const PARTICIPANT_KINDS = [
  ['an assisting member of a group', assistingMember],
  ['a member of a group who is not assisting', memberNotAssisting],
  ['an enrolled participant in no group', participantInNoGroup]
]

const STAFF_SETTERS = [
  ['a designer', () => designer(1)],
  ['an administrator', () => administrator(1)]
]

const MALFORMED_GROUP_NUMBERS = [
  ['0', (socket) => emit(socket, 'set_presenting_group', 0)],
  ['-1', (socket) => emit(socket, 'set_presenting_group', -1)],
  ['the text \'2\'', (socket) => emit(socket, 'set_presenting_group', '2')],
  ['no group number', (socket) => emit(socket, 'set_presenting_group')]
]

const EVENTS_NEEDING_A_HACKATHON = [
  ['set_presenting_group', (socket) => emit(socket, 'set_presenting_group', SECOND_GROUP)],
  ['enable_ratings_submission', (socket) => emit(socket, 'enable_ratings_submission')],
  ['get_group_presenting_state', (socket) => emit(socket, 'get_group_presenting_state')]
]

const emit = (socket, event, ...args) =>
  socket.timeout(ANSWER_TIMEOUT_MS).emitWithAck(event, ...args).catch(() => undefined)

const detailOf = (error) =>
  ['string', 'number'].includes(typeof error?.description) ? ` (${error.description})` : ''

const connectAs = (user, options) =>
  socketAs(user, options).catch((error) => {
    throw new Error(`real-time connection refused, expected it accepted: ${error?.message ?? error}${detailOf(error)}`)
  })

const aPresentationHackathon = async ({ evaluator } = {}) => {
  const edition = await anAnnouncedEdition()
  const firstSeed = await aPublishedSeed({ edition })
  const secondSeed = await aPublishedSeed({ edition })
  const hackathon = await anOngoingHackathonAt('GROUP_PRESENTATION', {
    edition,
    seeds: [firstSeed, secondSeed],
    participants: [memberNotAssisting(), participantInNoGroup()],
    assisting: [assistingMember()],
    evaluators: evaluator ? [evaluator] : []
  })
  await aGroup({ hackathon, seed: firstSeed, members: [assistingMember()] })
  await aGroup({ hackathon, seed: secondSeed, members: [memberNotAssisting()] })
  return hackathon
}

const anotherOngoingHackathon = () =>
  anOngoingHackathonAt('GROUP_PRESENTATION', { participants: [participantElsewhere()] })

const arrivalOf = (socket, event) =>
  nextEvent(socket, event).then((payload) => payload, () => NOT_RECEIVED)

const absenceOf = (socket, event) =>
  noEventArrives(socket, event, ABSENCE_WAIT_MS).then((absent) => (absent ? NOT_RECEIVED : RECEIVED))

const presentingGroupReceivedBy = async (receiver, sender, groupNumber) => {
  const arrival = arrivalOf(receiver, 'new_presenting_group')
  await emit(sender, 'set_presenting_group', groupNumber)
  return { newPresentingGroup: await arrival }
}

const presentingGroupMissedBy = async (receivers, sender, groupNumber) => {
  const absences = receivers.map((receiver) => absenceOf(receiver, 'new_presenting_group'))
  await emit(sender, 'set_presenting_group', groupNumber)
  return { newPresentingGroup: await Promise.all(absences) }
}

const ratingsOpeningReceivedBy = async (receiver, sender) => {
  const arrival = arrivalOf(receiver, 'ratings_submission_enabled').then((payload) => (payload === NOT_RECEIVED ? NOT_RECEIVED : RECEIVED))
  await emit(sender, 'enable_ratings_submission')
  return { ratingsSubmissionEnabled: await arrival }
}

const ratingsOpeningMissedBy = async (receivers, sender) => {
  const absences = receivers.map((receiver) => absenceOf(receiver, 'ratings_submission_enabled'))
  await emit(sender, 'enable_ratings_submission')
  return { ratingsSubmissionEnabled: await Promise.all(absences) }
}

const errorMessageTypeOn = async (socket, send) => {
  const errorMessage = nextEvent(socket, 'error_message').then((message) => message, () => undefined)
  await send(socket)
  return { errorMessage: typeof (await errorMessage) }
}

const presentingStateOf = (payload) => (Array.isArray(payload) ? payload[0] : payload)

const presentingGroupReadBy = async (socket) => {
  const arrival = arrivalOf(socket, 'group_presenting_state')
  await emit(socket, 'get_group_presenting_state')
  const payload = await arrival
  return { presentingGroup: payload === NOT_RECEIVED ? NOT_RECEIVED : presentingStateOf(payload)?.presentingGroup }
}

const presentingGroupOf = async (hackathon) =>
  presentingGroupReadBy(await connectAs(facilitator(3), { hackathon }))

const facilitatorPresenting = async (hackathon, groupNumber) => {
  const socket = await connectAs(facilitator(1), { hackathon })
  await emit(socket, 'set_presenting_group', groupNumber)
  return socket
}

describe('UC-060 · UC-051 · a facilitator sets the presenting group', () => {
  it.each(PARTICIPANT_KINDS)('UC-060 · UC-051 · %s who joined receives the new presenting group number', async (_kind, user) => {
    const hackathon = await aPresentationHackathon()
    const receiver = await connectAs(user(), { hackathon })
    const sender = await connectAs(facilitator(1), { hackathon })

    const outcome = await presentingGroupReceivedBy(receiver, sender, SECOND_GROUP)

    expect(outcome).toEqual({ newPresentingGroup: SECOND_GROUP })
  })

  it('UC-060 · another staff member who joined receives the new presenting group number', async () => {
    const hackathon = await aPresentationHackathon()
    const receiver = await connectAs(facilitator(2), { hackathon })
    const sender = await connectAs(facilitator(1), { hackathon })

    const outcome = await presentingGroupReceivedBy(receiver, sender, SECOND_GROUP)

    expect(outcome).toEqual({ newPresentingGroup: SECOND_GROUP })
  })

  it('UC-060 · BRU-025 · an evaluator who joined receives the new presenting group number', async () => {
    const evaluator = EVALUATORS.receiving()
    const hackathon = await aPresentationHackathon({ evaluator })
    const receiver = await connectAs(evaluator, { hackathon })
    const sender = await connectAs(facilitator(1), { hackathon })

    const outcome = await presentingGroupReceivedBy(receiver, sender, SECOND_GROUP)

    expect(outcome).toEqual({ newPresentingGroup: SECOND_GROUP })
  })

  it.each(STAFF_SETTERS)('UC-060 · %s sets the presenting group and a participant who joined receives it', async (_role, staffMember) => {
    const hackathon = await aPresentationHackathon()
    const receiver = await connectAs(participantInNoGroup(), { hackathon })
    const sender = await connectAs(staffMember(), { hackathon })

    const outcome = await presentingGroupReceivedBy(receiver, sender, SECOND_GROUP)

    expect(outcome).toEqual({ newPresentingGroup: SECOND_GROUP })
  })

  it('UC-060 · IRQ-006 · a client that joins after the change reads the new presenting group', async () => {
    const hackathon = await aPresentationHackathon()
    await facilitatorPresenting(hackathon, SECOND_GROUP)
    const latecomer = await connectAs(participantInNoGroup(), { hackathon })

    const outcome = await presentingGroupReadBy(latecomer)

    expect(outcome).toEqual({ presentingGroup: SECOND_GROUP })
  })

  it('UC-060 · a participant who joined another hackathon does not receive this hackathon\'s presenting group', async () => {
    const hackathon = await aPresentationHackathon()
    const elsewhere = await anotherOngoingHackathon()
    const outsider = await connectAs(participantElsewhere(), { hackathon: elsewhere })
    const sender = await connectAs(facilitator(1), { hackathon })

    const outcome = await presentingGroupMissedBy([outsider], sender, SECOND_GROUP)

    expect(outcome).toEqual({ newPresentingGroup: [NOT_RECEIVED] })
  })
})

describe('UC-060 · only staff set the presenting group', () => {
  it('UC-060 · a participant\'s presenting group change gets an error message', async () => {
    const hackathon = await aPresentationHackathon()
    const socket = await connectAs(memberNotAssisting(), { hackathon })

    const outcome = await errorMessageTypeOn(socket, (s) => emit(s, 'set_presenting_group', SECOND_GROUP))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-060 · a participant\'s presenting group change reaches nobody', async () => {
    const hackathon = await aPresentationHackathon()
    const otherParticipant = await connectAs(participantInNoGroup(), { hackathon })
    const staffMember = await connectAs(facilitator(2), { hackathon })
    const sender = await connectAs(memberNotAssisting(), { hackathon })

    const outcome = await presentingGroupMissedBy([otherParticipant, staffMember], sender, SECOND_GROUP)

    expect(outcome).toEqual({ newPresentingGroup: [NOT_RECEIVED, NOT_RECEIVED] })
  })

  it('UC-060 · IRQ-006 · after a participant\'s refused change, the presenting group is unchanged', async () => {
    const hackathon = await aPresentationHackathon()
    await facilitatorPresenting(hackathon, FIRST_GROUP)
    const sender = await connectAs(memberNotAssisting(), { hackathon })
    await emit(sender, 'set_presenting_group', SECOND_GROUP)

    const outcome = await presentingGroupOf(hackathon)

    expect(outcome).toEqual({ presentingGroup: FIRST_GROUP })
  })

  it('UC-060 · BRU-025 · an evaluator\'s presenting group change gets an error message', async () => {
    const evaluator = EVALUATORS.settingRefused()
    const hackathon = await aPresentationHackathon({ evaluator })
    const socket = await connectAs(evaluator, { hackathon })

    const outcome = await errorMessageTypeOn(socket, (s) => emit(s, 'set_presenting_group', SECOND_GROUP))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-060 · BRU-025 · an evaluator\'s presenting group change reaches nobody', async () => {
    const evaluator = EVALUATORS.settingUnheard()
    const hackathon = await aPresentationHackathon({ evaluator })
    const participantSocket = await connectAs(participantInNoGroup(), { hackathon })
    const staffMember = await connectAs(facilitator(2), { hackathon })
    const sender = await connectAs(evaluator, { hackathon })

    const outcome = await presentingGroupMissedBy([participantSocket, staffMember], sender, SECOND_GROUP)

    expect(outcome).toEqual({ newPresentingGroup: [NOT_RECEIVED, NOT_RECEIVED] })
  })

  it('UC-060 · IRQ-006 · BRU-025 · after an evaluator\'s refused change, the presenting group is unchanged', async () => {
    const evaluator = EVALUATORS.settingUnchanged()
    const hackathon = await aPresentationHackathon({ evaluator })
    await facilitatorPresenting(hackathon, FIRST_GROUP)
    const sender = await connectAs(evaluator, { hackathon })
    await emit(sender, 'set_presenting_group', SECOND_GROUP)

    const outcome = await presentingGroupOf(hackathon)

    expect(outcome).toEqual({ presentingGroup: FIRST_GROUP })
  })
})

describe('UC-060 · opening ratings', () => {
  it.each(PARTICIPANT_KINDS)('UC-060 · %s who joined receives the opening of ratings from a facilitator', async (_kind, user) => {
    const hackathon = await aPresentationHackathon()
    const receiver = await connectAs(user(), { hackathon })
    const sender = await connectAs(facilitator(1), { hackathon })

    const outcome = await ratingsOpeningReceivedBy(receiver, sender)

    expect(outcome).toEqual({ ratingsSubmissionEnabled: RECEIVED })
  })

  it('UC-060 · a participant\'s opening of ratings gets an error message', async () => {
    const hackathon = await aPresentationHackathon()
    const socket = await connectAs(memberNotAssisting(), { hackathon })

    const outcome = await errorMessageTypeOn(socket, (s) => emit(s, 'enable_ratings_submission'))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-060 · a participant\'s opening of ratings reaches nobody', async () => {
    const hackathon = await aPresentationHackathon()
    const otherParticipant = await connectAs(participantInNoGroup(), { hackathon })
    const staffMember = await connectAs(facilitator(2), { hackathon })
    const sender = await connectAs(memberNotAssisting(), { hackathon })

    const outcome = await ratingsOpeningMissedBy([otherParticipant, staffMember], sender)

    expect(outcome).toEqual({ ratingsSubmissionEnabled: [NOT_RECEIVED, NOT_RECEIVED] })
  })

  it('UC-060 · BRU-025 · an evaluator\'s opening of ratings gets an error message', async () => {
    const evaluator = EVALUATORS.openingRefused()
    const hackathon = await aPresentationHackathon({ evaluator })
    const socket = await connectAs(evaluator, { hackathon })

    const outcome = await errorMessageTypeOn(socket, (s) => emit(s, 'enable_ratings_submission'))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-060 · BRU-025 · an evaluator\'s opening of ratings reaches nobody', async () => {
    const evaluator = EVALUATORS.openingUnheard()
    const hackathon = await aPresentationHackathon({ evaluator })
    const participantSocket = await connectAs(participantInNoGroup(), { hackathon })
    const staffMember = await connectAs(facilitator(2), { hackathon })
    const sender = await connectAs(evaluator, { hackathon })

    const outcome = await ratingsOpeningMissedBy([participantSocket, staffMember], sender)

    expect(outcome).toEqual({ ratingsSubmissionEnabled: [NOT_RECEIVED, NOT_RECEIVED] })
  })
})

describe('UC-060 · bad presentation requests', () => {
  it.each(MALFORMED_GROUP_NUMBERS)('UC-060 · a presenting group change with %s gets an error message', async (_value, sendMalformed) => {
    const hackathon = await aPresentationHackathon()
    const socket = await connectAs(facilitator(1), { hackathon })

    const outcome = await errorMessageTypeOn(socket, sendMalformed)

    expect(outcome).toEqual(REFUSAL)
  })

  it.each(MALFORMED_GROUP_NUMBERS)('UC-060 · IRQ-006 · after a presenting group change with %s, the presenting group is unchanged', async (_value, sendMalformed) => {
    const hackathon = await aPresentationHackathon()
    const socket = await facilitatorPresenting(hackathon, FIRST_GROUP)
    await sendMalformed(socket)

    const outcome = await presentingGroupOf(hackathon)

    expect(outcome).toEqual({ presentingGroup: FIRST_GROUP })
  })

  it.each(MALFORMED_GROUP_NUMBERS)('UC-060 · a presenting group change with %s does not crash the server', async (_value, sendMalformed) => {
    const hackathon = await aPresentationHackathon()
    const socket = await connectAs(facilitator(1), { hackathon })

    await sendMalformed(socket)

    expect(await serverCrashes()).toEqual([])
  })

  it.each(EVENTS_NEEDING_A_HACKATHON)('UC-060 · %s from a socket that joined no hackathon gets an error message', async (_event, send) => {
    await aPresentationHackathon()
    const socket = await connectAs(facilitator(1))

    const outcome = await errorMessageTypeOn(socket, send)

    expect(outcome).toEqual(REFUSAL)
  })

  it.each(EVENTS_NEEDING_A_HACKATHON)('UC-060 · %s from a socket that joined no hackathon does not crash the server', async (_event, send) => {
    await aPresentationHackathon()
    const socket = await connectAs(facilitator(1))

    await send(socket)

    expect(await serverCrashes()).toEqual([])
  })
})
