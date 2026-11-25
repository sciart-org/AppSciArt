import { describe, it, expect } from 'vitest'
import {
  administrator,
  designer,
  facilitator,
  participant,
  anAnnouncedEdition,
  aPublishedSeed,
  anOngoingHackathonAt,
  aTeam,
  socketAs,
  nextEvent,
  noEventArrives,
  serverCrashes
} from '../support/index.js'

const ANSWER_TIMEOUT_MS = 2000

const ABSENCE_WAIT_MS = 1000

const FIRST_TEAM = 1

const SECOND_TEAM = 2

const REFUSAL = { errorMessage: 'string' }

const RECEIVED = 'received'

const NOT_RECEIVED = 'not received'

const assistingMember = () => participant(1)

const memberNotAssisting = () => participant(2)

const participantInNoTeam = () => participant(3)

const participantElsewhere = () => participant(5)

const EVALUATORS = {
  receiving: () => participant(6),
  settingRefused: () => participant(7),
  settingUnheard: () => participant(8),
  settingUnchanged: () => participant(9)
}

const PARTICIPANT_KINDS = [
  ['an assisting member of a team', assistingMember],
  ['a member of a team who is not assisting', memberNotAssisting],
  ['an enrolled participant in no team', participantInNoTeam]
]

const STAFF_SETTERS = [
  ['a designer', () => designer(1)],
  ['an administrator', () => administrator(1)]
]

const MALFORMED_TEAM_NUMBERS = [
  ['0', (socket) => emit(socket, 'set_presenting_team', 0)],
  ['-1', (socket) => emit(socket, 'set_presenting_team', -1)],
  ['the text \'2\'', (socket) => emit(socket, 'set_presenting_team', '2')],
  ['no team number', (socket) => emit(socket, 'set_presenting_team')]
]

const EVENTS_NEEDING_A_HACKATHON = [
  ['set_presenting_team', (socket) => emit(socket, 'set_presenting_team', SECOND_TEAM)],
  ['get_team_presenting_state', (socket) => emit(socket, 'get_team_presenting_state')]
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
  const hackathon = await anOngoingHackathonAt('TEAM_PRESENTATION', {
    edition,
    seeds: [firstSeed, secondSeed],
    participants: [memberNotAssisting(), participantInNoTeam()],
    assisting: [assistingMember()],
    evaluators: evaluator ? [evaluator] : []
  })
  await aTeam({ hackathon, seed: firstSeed, members: [assistingMember()], number: FIRST_TEAM })
  await aTeam({ hackathon, seed: secondSeed, members: [memberNotAssisting()], number: SECOND_TEAM })
  return hackathon
}

const anotherOngoingHackathon = () =>
  anOngoingHackathonAt('TEAM_PRESENTATION', { participants: [participantElsewhere()] })

const arrivalOf = (socket, event) =>
  nextEvent(socket, event).then((payload) => payload, () => NOT_RECEIVED)

const absenceOf = (socket, event) =>
  noEventArrives(socket, event, ABSENCE_WAIT_MS).then((absent) => (absent ? NOT_RECEIVED : RECEIVED))

const presentingTeamReceivedBy = async (receiver, sender, teamNumber) => {
  const arrival = arrivalOf(receiver, 'new_presenting_team')
  await emit(sender, 'set_presenting_team', teamNumber)
  return { newPresentingTeam: await arrival }
}

const presentingTeamMissedBy = async (receivers, sender, teamNumber) => {
  const absences = receivers.map((receiver) => absenceOf(receiver, 'new_presenting_team'))
  await emit(sender, 'set_presenting_team', teamNumber)
  return { newPresentingTeam: await Promise.all(absences) }
}

const errorMessageTypeOn = async (socket, send) => {
  const errorMessage = nextEvent(socket, 'error_message').then((message) => message, () => undefined)
  await send(socket)
  return { errorMessage: typeof (await errorMessage) }
}

const presentingStateOf = (payload) => (Array.isArray(payload) ? payload[0] : payload)

const presentingTeamReadBy = async (socket) => {
  const arrival = arrivalOf(socket, 'team_presenting_state')
  await emit(socket, 'get_team_presenting_state')
  const payload = await arrival
  return { presentingTeam: payload === NOT_RECEIVED ? NOT_RECEIVED : presentingStateOf(payload)?.presentingTeam }
}

const presentingTeamOf = async (hackathon) =>
  presentingTeamReadBy(await connectAs(facilitator(3), { hackathon }))

const facilitatorPresenting = async (hackathon, teamNumber) => {
  const socket = await connectAs(facilitator(1), { hackathon })
  await emit(socket, 'set_presenting_team', teamNumber)
  return socket
}

describe('UC-063 · UC-055 · a facilitator sets the presenting team', () => {
  it.each(PARTICIPANT_KINDS)('UC-063 · UC-055 · %s who joined receives the new presenting team number', async (_kind, user) => {
    const hackathon = await aPresentationHackathon()
    const receiver = await connectAs(user(), { hackathon })
    const sender = await connectAs(facilitator(1), { hackathon })

    const outcome = await presentingTeamReceivedBy(receiver, sender, SECOND_TEAM)

    expect(outcome).toEqual({ newPresentingTeam: SECOND_TEAM })
  })

  it('UC-063 · another staff member who joined receives the new presenting team number', async () => {
    const hackathon = await aPresentationHackathon()
    const receiver = await connectAs(facilitator(2), { hackathon })
    const sender = await connectAs(facilitator(1), { hackathon })

    const outcome = await presentingTeamReceivedBy(receiver, sender, SECOND_TEAM)

    expect(outcome).toEqual({ newPresentingTeam: SECOND_TEAM })
  })

  it('UC-063 · BRU-025 · an evaluator who joined receives the new presenting team number', async () => {
    const evaluator = EVALUATORS.receiving()
    const hackathon = await aPresentationHackathon({ evaluator })
    const receiver = await connectAs(evaluator, { hackathon })
    const sender = await connectAs(facilitator(1), { hackathon })

    const outcome = await presentingTeamReceivedBy(receiver, sender, SECOND_TEAM)

    expect(outcome).toEqual({ newPresentingTeam: SECOND_TEAM })
  })

  it.each(STAFF_SETTERS)('UC-063 · %s sets the presenting team and a participant who joined receives it', async (_role, staffMember) => {
    const hackathon = await aPresentationHackathon()
    const receiver = await connectAs(participantInNoTeam(), { hackathon })
    const sender = await connectAs(staffMember(), { hackathon })

    const outcome = await presentingTeamReceivedBy(receiver, sender, SECOND_TEAM)

    expect(outcome).toEqual({ newPresentingTeam: SECOND_TEAM })
  })

  it('UC-063 · IRQ-006 · a client that joins after the change reads the new presenting team', async () => {
    const hackathon = await aPresentationHackathon()
    await facilitatorPresenting(hackathon, SECOND_TEAM)
    const latecomer = await connectAs(participantInNoTeam(), { hackathon })

    const outcome = await presentingTeamReadBy(latecomer)

    expect(outcome).toEqual({ presentingTeam: SECOND_TEAM })
  })

  it('UC-063 · a participant who joined another hackathon does not receive this hackathon\'s presenting team', async () => {
    const hackathon = await aPresentationHackathon()
    const elsewhere = await anotherOngoingHackathon()
    const outsider = await connectAs(participantElsewhere(), { hackathon: elsewhere })
    const sender = await connectAs(facilitator(1), { hackathon })

    const outcome = await presentingTeamMissedBy([outsider], sender, SECOND_TEAM)

    expect(outcome).toEqual({ newPresentingTeam: [NOT_RECEIVED] })
  })
})

describe('UC-063 · only staff set the presenting team', () => {
  it('UC-063 · a participant\'s presenting team change gets an error message', async () => {
    const hackathon = await aPresentationHackathon()
    const socket = await connectAs(memberNotAssisting(), { hackathon })

    const outcome = await errorMessageTypeOn(socket, (s) => emit(s, 'set_presenting_team', SECOND_TEAM))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-063 · a participant\'s presenting team change reaches nobody', async () => {
    const hackathon = await aPresentationHackathon()
    const otherParticipant = await connectAs(participantInNoTeam(), { hackathon })
    const staffMember = await connectAs(facilitator(2), { hackathon })
    const sender = await connectAs(memberNotAssisting(), { hackathon })

    const outcome = await presentingTeamMissedBy([otherParticipant, staffMember], sender, SECOND_TEAM)

    expect(outcome).toEqual({ newPresentingTeam: [NOT_RECEIVED, NOT_RECEIVED] })
  })

  it('UC-063 · IRQ-006 · after a participant\'s refused change, the presenting team is unchanged', async () => {
    const hackathon = await aPresentationHackathon()
    await facilitatorPresenting(hackathon, FIRST_TEAM)
    const sender = await connectAs(memberNotAssisting(), { hackathon })
    await emit(sender, 'set_presenting_team', SECOND_TEAM)

    const outcome = await presentingTeamOf(hackathon)

    expect(outcome).toEqual({ presentingTeam: FIRST_TEAM })
  })

  it('UC-063 · BRU-025 · an evaluator\'s presenting team change gets an error message', async () => {
    const evaluator = EVALUATORS.settingRefused()
    const hackathon = await aPresentationHackathon({ evaluator })
    const socket = await connectAs(evaluator, { hackathon })

    const outcome = await errorMessageTypeOn(socket, (s) => emit(s, 'set_presenting_team', SECOND_TEAM))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-063 · BRU-025 · an evaluator\'s presenting team change reaches nobody', async () => {
    const evaluator = EVALUATORS.settingUnheard()
    const hackathon = await aPresentationHackathon({ evaluator })
    const participantSocket = await connectAs(participantInNoTeam(), { hackathon })
    const staffMember = await connectAs(facilitator(2), { hackathon })
    const sender = await connectAs(evaluator, { hackathon })

    const outcome = await presentingTeamMissedBy([participantSocket, staffMember], sender, SECOND_TEAM)

    expect(outcome).toEqual({ newPresentingTeam: [NOT_RECEIVED, NOT_RECEIVED] })
  })

  it('UC-063 · IRQ-006 · BRU-025 · after an evaluator\'s refused change, the presenting team is unchanged', async () => {
    const evaluator = EVALUATORS.settingUnchanged()
    const hackathon = await aPresentationHackathon({ evaluator })
    await facilitatorPresenting(hackathon, FIRST_TEAM)
    const sender = await connectAs(evaluator, { hackathon })
    await emit(sender, 'set_presenting_team', SECOND_TEAM)

    const outcome = await presentingTeamOf(hackathon)

    expect(outcome).toEqual({ presentingTeam: FIRST_TEAM })
  })
})

describe('UC-063 · bad presentation requests', () => {
  it.each(MALFORMED_TEAM_NUMBERS)('UC-063 · a presenting team change with %s gets an error message', async (_value, sendMalformed) => {
    const hackathon = await aPresentationHackathon()
    const socket = await connectAs(facilitator(1), { hackathon })

    const outcome = await errorMessageTypeOn(socket, sendMalformed)

    expect(outcome).toEqual(REFUSAL)
  })

  it.each(MALFORMED_TEAM_NUMBERS)('UC-063 · IRQ-006 · after a presenting team change with %s, the presenting team is unchanged', async (_value, sendMalformed) => {
    const hackathon = await aPresentationHackathon()
    const socket = await facilitatorPresenting(hackathon, FIRST_TEAM)
    await sendMalformed(socket)

    const outcome = await presentingTeamOf(hackathon)

    expect(outcome).toEqual({ presentingTeam: FIRST_TEAM })
  })

  it.each(MALFORMED_TEAM_NUMBERS)('UC-063 · a presenting team change with %s does not crash the server', async (_value, sendMalformed) => {
    const hackathon = await aPresentationHackathon()
    const socket = await connectAs(facilitator(1), { hackathon })

    await sendMalformed(socket)

    expect(await serverCrashes()).toEqual([])
  })

  it.each(EVENTS_NEEDING_A_HACKATHON)('UC-063 · %s from a socket that joined no hackathon gets an error message', async (_event, send) => {
    await aPresentationHackathon()
    const socket = await connectAs(facilitator(1))

    const outcome = await errorMessageTypeOn(socket, send)

    expect(outcome).toEqual(REFUSAL)
  })

  it.each(EVENTS_NEEDING_A_HACKATHON)('UC-063 · %s from a socket that joined no hackathon does not crash the server', async (_event, send) => {
    await aPresentationHackathon()
    const socket = await connectAs(facilitator(1))

    await send(socket)

    expect(await serverCrashes()).toEqual([])
  })
})
