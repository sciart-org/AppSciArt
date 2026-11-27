import { describe, it, expect } from 'vitest'
import {
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

const RATING = 0.8

const CHANGED_RATING = 0.3

const REFUSAL = { errorMessage: 'string' }

const RECEIVED = 'received'

const NOT_RECEIVED = 'not received'

const assistingInNoGroup = () => participant(1)

const firstGroupMember = () => participant(2)

const secondGroupMember = () => participant(3)

const notAssisting = () => participant(4)

const facilitatorOpeningRatings = () => facilitator(1)

const staffObserver = () => facilitator(2)

const staffReader = () => facilitator(3)

const EVALUATORS = {
  receiving: () => participant(5),
  reading: () => participant(6),
  submittingRefused: () => participant(7),
  submittingUnheard: () => participant(8),
  submittingUnrecorded: () => participant(9)
}

const emit = (socket, event, ...args) =>
  socket.timeout(ANSWER_TIMEOUT_MS).emitWithAck(event, ...args).catch(() => undefined)

const detailOf = (error) =>
  ['string', 'number'].includes(typeof error?.description) ? ` (${error.description})` : ''

const connectAs = (user, options) =>
  socketAs(user, options).catch((error) => {
    throw new Error(`real-time connection refused, expected it accepted: ${error?.message ?? error}${detailOf(error)}`)
  })

const aRatingsHackathon = async ({ evaluator } = {}) => {
  const edition = await anAnnouncedEdition()
  const firstSeed = await aPublishedSeed({ edition })
  const secondSeed = await aPublishedSeed({ edition })
  const hackathon = await anOngoingHackathonAt('GROUP_PRESENTATION', {
    edition,
    seeds: [firstSeed, secondSeed],
    participants: [notAssisting()],
    assisting: [assistingInNoGroup(), firstGroupMember(), secondGroupMember()],
    evaluators: evaluator ? [evaluator] : []
  })
  await aGroup({ hackathon, seed: firstSeed, members: [firstGroupMember()] })
  await aGroup({ hackathon, seed: secondSeed, members: [secondGroupMember()] })
  return { hackathon, seeds: [firstSeed, secondSeed] }
}

const ratingsFor = (seeds, rating = RATING) => seeds.map((seed) => ({ seedId: seed.id, rating }))

const bySeed = (list) =>
  Array.isArray(list) ? [...list].sort((a, b) => String(a?.seedId).localeCompare(String(b?.seedId))) : list

const openRatings = async (hackathon) => {
  const socket = await connectAs(facilitatorOpeningRatings(), { hackathon })
  await emit(socket, 'enable_ratings_submission')
  return socket
}

const arrivalOf = (socket, event) =>
  nextEvent(socket, event).then((payload) => payload, () => NOT_RECEIVED)

const absenceOf = (socket, event) =>
  noEventArrives(socket, event, ABSENCE_WAIT_MS).then((absent) => (absent ? NOT_RECEIVED : RECEIVED))

const entryOf = (payload, user) =>
  payload === NOT_RECEIVED ? NOT_RECEIVED : { [user.id]: bySeed(payload?.[user.id]) }

const expectedEntry = (user, list) => ({ ratings: { [user.id]: bySeed(list) } })

const noEntry = (user) => ({ ratings: { [user.id]: undefined } })

const submit = (socket, list) => emit(socket, 'submit_ratings', list)

const ratingsReceivedBy = async (receiver, sender, user, list) => {
  const arrival = arrivalOf(receiver, 'ratings')
  await submit(sender, list)
  return { ratings: entryOf(await arrival, user) }
}

const ratingsMissedBy = async (receiver, sender, list) => {
  const absence = absenceOf(receiver, 'ratings')
  await submit(sender, list)
  return { ratings: await absence }
}

const ratingsReadBy = async (reader, user) => {
  const arrival = arrivalOf(reader, 'ratings')
  await emit(reader, 'get_ratings')
  return { ratings: entryOf(await arrival, user) }
}

const ratingsOf = async (hackathon, user) =>
  ratingsReadBy(await connectAs(staffReader(), { hackathon }), user)

const errorMessageTypeOn = async (socket, send) => {
  const errorMessage = nextEvent(socket, 'error_message').then((message) => message, () => undefined)
  await send(socket)
  return { errorMessage: typeof (await errorMessage) }
}

const submittedBy = async (hackathon, user, list) => {
  const socket = await connectAs(user, { hackathon })
  await submit(socket, list)
  return socket
}

describe('UC-052 · a participant submits their seed ratings', () => {
  it('UC-052 · UC-050 · the joined facilitator receives the ratings a participant submitted for every group\'s seed', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const receiver = await connectAs(staffObserver(), { hackathon })
    await openRatings(hackathon)
    const sender = await connectAs(assistingInNoGroup(), { hackathon })
    const list = ratingsFor(seeds)

    const outcome = await ratingsReceivedBy(receiver, sender, assistingInNoGroup(), list)

    expect(outcome).toEqual(expectedEntry(assistingInNoGroup(), list))
  })

  it('UC-052 · BRU-025 · the joined evaluator receives the ratings a participant submitted', async () => {
    const evaluator = EVALUATORS.receiving()
    const { hackathon, seeds } = await aRatingsHackathon({ evaluator })
    const receiver = await connectAs(evaluator, { hackathon })
    await openRatings(hackathon)
    const sender = await connectAs(assistingInNoGroup(), { hackathon })
    const list = ratingsFor(seeds)

    const outcome = await ratingsReceivedBy(receiver, sender, assistingInNoGroup(), list)

    expect(outcome).toEqual(expectedEntry(assistingInNoGroup(), list))
  })

  it('UC-052 · UC-057 · an enrolled participant who is not assisting submits their ratings', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const receiver = await connectAs(staffObserver(), { hackathon })
    await openRatings(hackathon)
    const sender = await connectAs(notAssisting(), { hackathon })
    const list = ratingsFor(seeds)

    const outcome = await ratingsReceivedBy(receiver, sender, notAssisting(), list)

    expect(outcome).toEqual(expectedEntry(notAssisting(), list))
  })

  it('UC-052 · BRU-023 · a participant submits a rating for their own group\'s seed', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const receiver = await connectAs(staffObserver(), { hackathon })
    await openRatings(hackathon)
    const sender = await connectAs(firstGroupMember(), { hackathon })
    const list = ratingsFor(seeds)

    const outcome = await ratingsReceivedBy(receiver, sender, firstGroupMember(), list)

    expect(outcome).toEqual(expectedEntry(firstGroupMember(), list))
  })
})

describe('UC-052 · reading submitted ratings', () => {
  it('UC-052 · a facilitator reads the ratings a participant submitted', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    await openRatings(hackathon)
    const list = ratingsFor(seeds)
    await submittedBy(hackathon, assistingInNoGroup(), list)
    const reader = await connectAs(staffReader(), { hackathon })

    const outcome = await ratingsReadBy(reader, assistingInNoGroup())

    expect(outcome).toEqual(expectedEntry(assistingInNoGroup(), list))
  })

  it('UC-052 · BRU-025 · an evaluator reads the ratings a participant submitted', async () => {
    const evaluator = EVALUATORS.reading()
    const { hackathon, seeds } = await aRatingsHackathon({ evaluator })
    await openRatings(hackathon)
    const list = ratingsFor(seeds)
    await submittedBy(hackathon, assistingInNoGroup(), list)
    const reader = await connectAs(evaluator, { hackathon })

    const outcome = await ratingsReadBy(reader, assistingInNoGroup())

    expect(outcome).toEqual(expectedEntry(assistingInNoGroup(), list))
  })

  it('UC-052 · a participant\'s request for the ratings gets an error message', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    await openRatings(hackathon)
    const socket = await submittedBy(hackathon, assistingInNoGroup(), ratingsFor(seeds))

    const outcome = await errorMessageTypeOn(socket, (s) => emit(s, 'get_ratings'))

    expect(outcome).toEqual(REFUSAL)
  })
})

describe('UC-052 · a submission before ratings open is refused', () => {
  it('UC-052 · a submission before ratings open gets an error message', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const socket = await connectAs(assistingInNoGroup(), { hackathon })

    const outcome = await errorMessageTypeOn(socket, (s) => submit(s, ratingsFor(seeds)))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-052 · a submission before ratings open reaches no staff member', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const receiver = await connectAs(staffObserver(), { hackathon })
    const sender = await connectAs(assistingInNoGroup(), { hackathon })

    const outcome = await ratingsMissedBy(receiver, sender, ratingsFor(seeds))

    expect(outcome).toEqual({ ratings: NOT_RECEIVED })
  })

  it('UC-052 · after a submission before ratings open, a facilitator reads no ratings of that participant', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    await submittedBy(hackathon, assistingInNoGroup(), ratingsFor(seeds))

    const outcome = await ratingsOf(hackathon, assistingInNoGroup())

    expect(outcome).toEqual(noEntry(assistingInNoGroup()))
  })
})

describe('UC-052 · a submission without a rating for every group\'s seed is refused', () => {
  it('UC-052 · a submission missing a group\'s seed gets an error message', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    await openRatings(hackathon)
    const socket = await connectAs(assistingInNoGroup(), { hackathon })

    const outcome = await errorMessageTypeOn(socket, (s) => submit(s, ratingsFor([seeds[0]])))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-052 · a submission missing a group\'s seed reaches no staff member', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const receiver = await connectAs(staffObserver(), { hackathon })
    await openRatings(hackathon)
    const sender = await connectAs(assistingInNoGroup(), { hackathon })

    const outcome = await ratingsMissedBy(receiver, sender, ratingsFor([seeds[0]]))

    expect(outcome).toEqual({ ratings: NOT_RECEIVED })
  })

  it('UC-052 · after a submission missing a group\'s seed, a facilitator reads no ratings of that participant', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    await openRatings(hackathon)
    await submittedBy(hackathon, assistingInNoGroup(), ratingsFor([seeds[0]]))

    const outcome = await ratingsOf(hackathon, assistingInNoGroup())

    expect(outcome).toEqual(noEntry(assistingInNoGroup()))
  })
})

describe('UC-052 · BRU-042 · a second submission is refused', () => {
  it('UC-052 · BRU-042 · a second submission gets an error message', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    await openRatings(hackathon)
    const socket = await submittedBy(hackathon, assistingInNoGroup(), ratingsFor(seeds))

    const outcome = await errorMessageTypeOn(socket, (s) => submit(s, ratingsFor(seeds, CHANGED_RATING)))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-052 · BRU-042 · a second submission reaches no staff member', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const receiver = await connectAs(staffObserver(), { hackathon })
    await openRatings(hackathon)
    const sender = await connectAs(assistingInNoGroup(), { hackathon })
    await ratingsReceivedBy(receiver, sender, assistingInNoGroup(), ratingsFor(seeds))

    const outcome = await ratingsMissedBy(receiver, sender, ratingsFor(seeds, CHANGED_RATING))

    expect(outcome).toEqual({ ratings: NOT_RECEIVED })
  })

  it('UC-052 · BRU-042 · after a second submission, a facilitator still reads the first ratings', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    await openRatings(hackathon)
    const first = ratingsFor(seeds)
    const socket = await submittedBy(hackathon, assistingInNoGroup(), first)
    await submit(socket, ratingsFor(seeds, CHANGED_RATING))

    const outcome = await ratingsOf(hackathon, assistingInNoGroup())

    expect(outcome).toEqual(expectedEntry(assistingInNoGroup(), first))
  })
})

describe('UC-052 · BRU-025 · an evaluator\'s submission is refused', () => {
  it('UC-052 · BRU-025 · an evaluator\'s submission gets an error message', async () => {
    const evaluator = EVALUATORS.submittingRefused()
    const { hackathon, seeds } = await aRatingsHackathon({ evaluator })
    await openRatings(hackathon)
    const socket = await connectAs(evaluator, { hackathon })

    const outcome = await errorMessageTypeOn(socket, (s) => submit(s, ratingsFor(seeds)))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-052 · BRU-025 · an evaluator\'s submission reaches no staff member', async () => {
    const evaluator = EVALUATORS.submittingUnheard()
    const { hackathon, seeds } = await aRatingsHackathon({ evaluator })
    const receiver = await connectAs(staffObserver(), { hackathon })
    await openRatings(hackathon)
    const sender = await connectAs(evaluator, { hackathon })

    const outcome = await ratingsMissedBy(receiver, sender, ratingsFor(seeds))

    expect(outcome).toEqual({ ratings: NOT_RECEIVED })
  })

  it('UC-052 · BRU-025 · after an evaluator\'s submission, a facilitator reads no ratings of that evaluator', async () => {
    const evaluator = EVALUATORS.submittingUnrecorded()
    const { hackathon, seeds } = await aRatingsHackathon({ evaluator })
    await openRatings(hackathon)
    await submittedBy(hackathon, evaluator, ratingsFor(seeds))

    const outcome = await ratingsOf(hackathon, evaluator)

    expect(outcome).toEqual(noEntry(evaluator))
  })
})

describe('UC-052 · a facilitator\'s submission is refused', () => {
  it('UC-052 · a facilitator\'s submission gets an error message', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const socket = await openRatings(hackathon)

    const outcome = await errorMessageTypeOn(socket, (s) => submit(s, ratingsFor(seeds)))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-052 · a facilitator\'s submission reaches no other staff member', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const receiver = await connectAs(staffObserver(), { hackathon })
    const sender = await openRatings(hackathon)

    const outcome = await ratingsMissedBy(receiver, sender, ratingsFor(seeds))

    expect(outcome).toEqual({ ratings: NOT_RECEIVED })
  })

  it('UC-052 · after a facilitator\'s submission, a facilitator reads no ratings of that facilitator', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const socket = await openRatings(hackathon)
    await submit(socket, ratingsFor(seeds))

    const outcome = await ratingsOf(hackathon, facilitatorOpeningRatings())

    expect(outcome).toEqual(noEntry(facilitatorOpeningRatings()))
  })
})

const repeatingFirstSeed = (seeds) => ratingsFor([seeds[0], seeds[0]])

const replacingSecondSeedWith = (seeds, outsideSeed) => ratingsFor([seeds[0], outsideSeed])

describe('UC-052 · a submission that repeats a group\'s seed in place of another\'s is refused', () => {
  it('UC-052 · a submission repeating a group\'s seed in place of another\'s gets an error message', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    await openRatings(hackathon)
    const socket = await connectAs(assistingInNoGroup(), { hackathon })

    const outcome = await errorMessageTypeOn(socket, (s) => submit(s, repeatingFirstSeed(seeds)))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-052 · a submission repeating a group\'s seed in place of another\'s reaches no staff member', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const receiver = await connectAs(staffObserver(), { hackathon })
    await openRatings(hackathon)
    const sender = await connectAs(assistingInNoGroup(), { hackathon })

    const outcome = await ratingsMissedBy(receiver, sender, repeatingFirstSeed(seeds))

    expect(outcome).toEqual({ ratings: NOT_RECEIVED })
  })

  it('UC-052 · after a submission repeating a group\'s seed in place of another\'s, a facilitator reads no ratings of that participant', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    await openRatings(hackathon)
    await submittedBy(hackathon, assistingInNoGroup(), repeatingFirstSeed(seeds))

    const outcome = await ratingsOf(hackathon, assistingInNoGroup())

    expect(outcome).toEqual(noEntry(assistingInNoGroup()))
  })
})

describe('UC-052 · a submission that replaces a group\'s seed with a seed outside the hackathon is refused', () => {
  it('UC-052 · a submission replacing a group\'s seed with a seed outside the hackathon gets an error message', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const outsideSeed = await aPublishedSeed()
    await openRatings(hackathon)
    const socket = await connectAs(assistingInNoGroup(), { hackathon })

    const outcome = await errorMessageTypeOn(socket, (s) => submit(s, replacingSecondSeedWith(seeds, outsideSeed)))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-052 · a submission replacing a group\'s seed with a seed outside the hackathon reaches no staff member', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const outsideSeed = await aPublishedSeed()
    const receiver = await connectAs(staffObserver(), { hackathon })
    await openRatings(hackathon)
    const sender = await connectAs(assistingInNoGroup(), { hackathon })

    const outcome = await ratingsMissedBy(receiver, sender, replacingSecondSeedWith(seeds, outsideSeed))

    expect(outcome).toEqual({ ratings: NOT_RECEIVED })
  })

  it('UC-052 · after a submission replacing a group\'s seed with a seed outside the hackathon, a facilitator reads no ratings of that participant', async () => {
    const { hackathon, seeds } = await aRatingsHackathon()
    const outsideSeed = await aPublishedSeed()
    await openRatings(hackathon)
    await submittedBy(hackathon, assistingInNoGroup(), replacingSecondSeedWith(seeds, outsideSeed))

    const outcome = await ratingsOf(hackathon, assistingInNoGroup())

    expect(outcome).toEqual(noEntry(assistingInNoGroup()))
  })
})

const MALFORMED_SUBMISSIONS = [
  ['a value that is not a list', () => 'not a list'],
  ['a seedId that is not an id', (seeds) => [{ seedId: 'not an id', rating: RATING }, { seedId: seeds[1].id, rating: RATING }]],
  ['a rating that is not a number', (seeds) => [{ seedId: seeds[0].id, rating: 'high' }, { seedId: seeds[1].id, rating: RATING }]]
]

const EVENTS_NEEDING_A_HACKATHON = [
  ['submit_ratings', assistingInNoGroup, (socket, seeds) => submit(socket, ratingsFor(seeds))],
  ['get_ratings', staffReader, (socket) => emit(socket, 'get_ratings')]
]

describe('UC-052 · bad rating requests', () => {
  it.each(MALFORMED_SUBMISSIONS)('UC-052 · a submission with %s gets an error message', async (_value, malformed) => {
    const { hackathon, seeds } = await aRatingsHackathon()
    await openRatings(hackathon)
    const socket = await connectAs(assistingInNoGroup(), { hackathon })

    const outcome = await errorMessageTypeOn(socket, (s) => submit(s, malformed(seeds)))

    expect(outcome).toEqual(REFUSAL)
  })

  it.each(MALFORMED_SUBMISSIONS)('UC-052 · a submission with %s does not crash the server', async (_value, malformed) => {
    const { hackathon, seeds } = await aRatingsHackathon()
    await openRatings(hackathon)
    const socket = await connectAs(assistingInNoGroup(), { hackathon })

    await submit(socket, malformed(seeds))

    expect(await serverCrashes()).toEqual([])
  })

  it.each(EVENTS_NEEDING_A_HACKATHON)('UC-052 · %s from a socket that joined no hackathon gets an error message', async (_event, user, send) => {
    const { seeds } = await aRatingsHackathon()
    const socket = await connectAs(user())

    const outcome = await errorMessageTypeOn(socket, (s) => send(s, seeds))

    expect(outcome).toEqual(REFUSAL)
  })

  it.each(EVENTS_NEEDING_A_HACKATHON)('UC-052 · %s from a socket that joined no hackathon does not crash the server', async (_event, user, send) => {
    const { seeds } = await aRatingsHackathon()
    const socket = await connectAs(user())

    await send(socket, seeds)

    expect(await serverCrashes()).toEqual([])
  })
})
