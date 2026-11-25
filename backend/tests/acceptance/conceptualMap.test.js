import { describe, it, expect } from 'vitest'
import {
  as,
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

const STORE_WAIT_MS = 5000

const POLL_INTERVAL_MS = 200

const REFUSAL = { errorMessage: 'string' }

const NOT_RECEIVED = 'not received'

const nodesLabelled = (...labels) =>
  labels.map((label, index) => ({ id: `n${index + 1}`, position: { x: index * 100, y: 0 }, data: { label } }))

const EDGES = [{ id: 'e1', source: 'n1', target: 'n2' }]

const STARTING_MAP = { nodes: nodesLabelled('Starting idea'), edges: [] }

const MALFORMED_NODE_UPDATES = [
  ['a text instead of a list', 'not a list'],
  ['an object instead of a list', { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Alone' } }],
  ['nodes without an id', [{ position: { x: 0, y: 0 }, data: { label: 'No id' } }]]
]

const EVENTS_NEEDING_A_HACKATHON = [
  ['get_initial_state', (socket) => emit(socket, 'get_initial_state')],
  ['update_nodes', (socket) => emit(socket, 'update_nodes', nodesLabelled('Lost idea'))]
]

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const isItemList = (value) =>
  Array.isArray(value) && value.length > 0 && value.every((item) => typeof item?.id === 'string')

const parsedIfJson = (value) => {
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const listUnderKey = (root, key) => {
  const queue = [parsedIfJson(root)]
  while (queue.length > 0) {
    const value = queue.shift()
    if (value && typeof value === 'object') {
      if (!Array.isArray(value) && Array.isArray(parsedIfJson(value[key]))) return parsedIfJson(value[key])
      queue.push(...Object.values(value).map(parsedIfJson))
    }
  }
  return undefined
}

const receivedList = (payload, key) => {
  if (isItemList(payload)) return payload
  return listUnderKey(payload, key) ?? (Array.isArray(payload) ? payload.find(isItemList) : undefined)
}

const sortedById = (list) =>
  Array.isArray(list) ? [...list].sort((a, b) => String(a?.id).localeCompare(String(b?.id))) : list

const emit = (socket, event, ...args) =>
  socket.timeout(ANSWER_TIMEOUT_MS).emitWithAck(event, ...args).catch(() => undefined)

const detailOf = (error) =>
  ['string', 'number'].includes(typeof error?.description) ? ` (${error.description})` : ''

const connectAs = (user, options) =>
  socketAs(user, options).catch((error) => {
    throw new Error(`real-time connection refused, expected it accepted: ${error?.message ?? error}${detailOf(error)}`)
  })

const watching = async (user, hackathon, group) => {
  const socket = await connectAs(user, { hackathon })
  await emit(socket, 'watch_group', group.id)
  return socket
}

const listArrival = (socket, event, key) =>
  nextEvent(socket, event).then((payload) => sortedById(receivedList(payload, key)), () => NOT_RECEIVED)

const listAbsence = (socket, event) =>
  noEventArrives(socket, event, ABSENCE_WAIT_MS).then((absent) => (absent ? NOT_RECEIVED : 'received'))

const nodesReceivedBy = async (receiver, sender, nodes) => {
  const arrival = listArrival(receiver, 'new_nodes', 'nodes')
  await emit(sender, 'update_nodes', nodes)
  return { newNodes: await arrival }
}

const edgesReceivedBy = async (receiver, sender, edges) => {
  const arrival = listArrival(receiver, 'new_edges', 'edges')
  await emit(sender, 'update_edges', edges)
  return { newEdges: await arrival }
}

const nodesMissedBy = async (receiver, sender, nodes) => {
  const absence = listAbsence(receiver, 'new_nodes')
  await emit(sender, 'update_nodes', nodes)
  return { newNodes: await absence }
}

const initialNodesOf = async (socket) => {
  const arrival = listArrival(socket, 'initial_state', 'nodes')
  await emit(socket, 'get_initial_state')
  return { initialNodes: await arrival }
}

const errorMessageTypeOn = async (socket, send) => {
  const errorMessage = nextEvent(socket, 'error_message').then((message) => message, () => undefined)
  await send(socket)
  return { errorMessage: typeof (await errorMessage) }
}

const sameJson = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const storedNodesOnceSaved = async (group, expectedNodes) => {
  const api = await as(facilitator(5))
  const expected = { status: 200, storedNodes: sortedById(expectedNodes) }
  const deadline = Date.now() + STORE_WAIT_MS
  let outcome
  do {
    const res = await api.get(`/exploring-groups/${group.id}/conceptual-map`)
    outcome = { status: res.status, storedNodes: sortedById(listUnderKey(res.body, 'nodes')) }
    if (sameJson(outcome, expected)) return outcome
    await pause(POLL_INTERVAL_MS)
  } while (Date.now() < deadline)
  return outcome
}

const aGroupWorkHackathon = async ({ members, others = [], loners = [], evaluators = [], map = null }) => {
  const edition = await anAnnouncedEdition()
  const seed = await aPublishedSeed({ edition })
  const otherSeed = await aPublishedSeed({ edition })
  const hackathon = await anOngoingHackathonAt('GROUP_WORK', {
    edition,
    seeds: [seed, otherSeed],
    participants: [...members, ...others, ...loners],
    evaluators
  })
  const group = await aGroup({ hackathon, seed, members, map })
  const otherGroup = others.length > 0 ? await aGroup({ hackathon, seed: otherSeed, members: others }) : undefined
  return { hackathon, group, otherGroup }
}

describe('UC-048 · FRQ-017 · members edit their group map together', () => {
  it('UC-048 · FRQ-017 · a member\'s node update reaches another member of the group with the same nodes', async () => {
    const [author, teammate] = [participant(1), participant(2)]
    const { hackathon } = await aGroupWorkHackathon({ members: [author, teammate] })
    const authorSocket = await connectAs(author, { hackathon })
    const teammateSocket = await connectAs(teammate, { hackathon })
    const nodes = nodesLabelled('Light', 'Shadow')

    const outcome = await nodesReceivedBy(teammateSocket, authorSocket, nodes)

    expect(outcome).toEqual({ newNodes: sortedById(nodes) })
  })

  it('UC-048 · FRQ-017 · a member\'s edge update reaches another member of the group with the same edges', async () => {
    const [author, teammate] = [participant(1), participant(2)]
    const { hackathon } = await aGroupWorkHackathon({ members: [author, teammate] })
    const authorSocket = await connectAs(author, { hackathon })
    const teammateSocket = await connectAs(teammate, { hackathon })

    const outcome = await edgesReceivedBy(teammateSocket, authorSocket, EDGES)

    expect(outcome).toEqual({ newEdges: sortedById(EDGES) })
  })

  it('UC-048 · FRQ-017 · after a member\'s change, another member\'s initial state has the changed nodes', async () => {
    const [author, teammate] = [participant(1), participant(2)]
    const { hackathon } = await aGroupWorkHackathon({ members: [author, teammate] })
    const authorSocket = await connectAs(author, { hackathon })
    const teammateSocket = await connectAs(teammate, { hackathon })
    const nodes = nodesLabelled('Changed idea', 'Second idea')
    await emit(authorSocket, 'update_nodes', nodes)

    const outcome = await initialNodesOf(teammateSocket)

    expect(outcome).toEqual({ initialNodes: sortedById(nodes) })
  })

  it('UC-048 · FRQ-017 · a participant placed in a group after joining joins again and receives the group\'s node updates', async () => {
    const [latecomer, author] = [participant(1), participant(2)]
    const edition = await anAnnouncedEdition()
    const seed = await aPublishedSeed({ edition })
    const hackathon = await anOngoingHackathonAt('GROUP_WORK', { edition, seeds: [seed], participants: [latecomer, author] })
    const latecomerSocket = await connectAs(latecomer, { hackathon })
    await aGroup({ hackathon, seed, members: [author, latecomer] })
    const authorSocket = await connectAs(author, { hackathon })
    await emit(latecomerSocket, 'join_hackathon_rooms', hackathon.id)
    const nodes = nodesLabelled('Welcome')

    const outcome = await nodesReceivedBy(latecomerSocket, authorSocket, nodes)

    expect(outcome).toEqual({ newNodes: sortedById(nodes) })
  })
})

describe('UC-048 · other participants stay out of the group map', () => {
  it('UC-048 · a member of another group does not receive this group\'s node updates', async () => {
    const [author, outsider] = [participant(1), participant(3)]
    const { hackathon } = await aGroupWorkHackathon({ members: [author, participant(2)], others: [outsider] })
    const authorSocket = await connectAs(author, { hackathon })
    const outsiderSocket = await connectAs(outsider, { hackathon })

    const outcome = await nodesMissedBy(outsiderSocket, authorSocket, nodesLabelled('Private idea'))

    expect(outcome).toEqual({ newNodes: NOT_RECEIVED })
  })

  it('UC-048 · a member of another group\'s node update does not reach this group\'s members', async () => {
    const [member, outsider] = [participant(1), participant(3)]
    const { hackathon } = await aGroupWorkHackathon({ members: [member, participant(2)], others: [outsider] })
    const memberSocket = await connectAs(member, { hackathon })
    const outsiderSocket = await connectAs(outsider, { hackathon })

    const outcome = await nodesMissedBy(memberSocket, outsiderSocket, nodesLabelled('Foreign idea'))

    expect(outcome).toEqual({ newNodes: NOT_RECEIVED })
  })

  it('UC-048 · an enrolled participant with no group gets an error message asking for the initial state', async () => {
    const loner = participant(4)
    const { hackathon } = await aGroupWorkHackathon({ members: [participant(1), participant(2)], loners: [loner] })
    const lonerSocket = await connectAs(loner, { hackathon })

    const outcome = await errorMessageTypeOn(lonerSocket, (socket) => emit(socket, 'get_initial_state'))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-048 · an enrolled participant with no group gets an error message updating nodes', async () => {
    const loner = participant(4)
    const { hackathon } = await aGroupWorkHackathon({ members: [participant(1), participant(2)], loners: [loner] })
    const lonerSocket = await connectAs(loner, { hackathon })

    const outcome = await errorMessageTypeOn(lonerSocket, (socket) => emit(socket, 'update_nodes', nodesLabelled('Stray idea')))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-048 · a participant gets an error message watching another group', async () => {
    const outsider = participant(3)
    const { hackathon, group } = await aGroupWorkHackathon({ members: [participant(1), participant(2)], others: [outsider] })
    const outsiderSocket = await connectAs(outsider, { hackathon })

    const outcome = await errorMessageTypeOn(outsiderSocket, (socket) => emit(socket, 'watch_group', group.id))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-048 · a participant gets an error message watching their own group', async () => {
    const member = participant(1)
    const { hackathon, group } = await aGroupWorkHackathon({ members: [member, participant(2)] })
    const memberSocket = await connectAs(member, { hackathon })

    const outcome = await errorMessageTypeOn(memberSocket, (socket) => emit(socket, 'watch_group', group.id))

    expect(outcome).toEqual(REFUSAL)
  })
})

describe('UC-048 · BRU-025 · evaluators only watch the group map', () => {
  it('UC-048 · BRU-025 · an evaluator watching the group receives the members\' node updates', async () => {
    const [author, evaluator] = [participant(1), participant(10)]
    const { hackathon, group } = await aGroupWorkHackathon({ members: [author, participant(2)], evaluators: [evaluator] })
    const authorSocket = await connectAs(author, { hackathon })
    const evaluatorSocket = await watching(evaluator, hackathon, group)
    const nodes = nodesLabelled('Observed idea')

    const outcome = await nodesReceivedBy(evaluatorSocket, authorSocket, nodes)

    expect(outcome).toEqual({ newNodes: sortedById(nodes) })
  })

  it('UC-048 · BRU-025 · an evaluator\'s node update gets an error message', async () => {
    const evaluator = participant(11)
    const { hackathon, group } = await aGroupWorkHackathon({ members: [participant(1), participant(2)], evaluators: [evaluator] })
    const evaluatorSocket = await watching(evaluator, hackathon, group)

    const outcome = await errorMessageTypeOn(evaluatorSocket, (socket) => emit(socket, 'update_nodes', nodesLabelled('Evaluator idea')))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-048 · BRU-025 · an evaluator\'s node update does not reach the members', async () => {
    const [member, evaluator] = [participant(1), participant(12)]
    const { hackathon, group } = await aGroupWorkHackathon({ members: [member, participant(2)], evaluators: [evaluator] })
    const memberSocket = await connectAs(member, { hackathon })
    const evaluatorSocket = await watching(evaluator, hackathon, group)

    const outcome = await nodesMissedBy(memberSocket, evaluatorSocket, nodesLabelled('Evaluator idea'))

    expect(outcome).toEqual({ newNodes: NOT_RECEIVED })
  })
})

describe('UC-048 · staff follow and change the group map', () => {
  it('UC-048 · a facilitator watching the group receives the members\' node updates', async () => {
    const author = participant(1)
    const { hackathon, group } = await aGroupWorkHackathon({ members: [author, participant(2)] })
    const authorSocket = await connectAs(author, { hackathon })
    const facilitatorSocket = await watching(facilitator(1), hackathon, group)
    const nodes = nodesLabelled('Followed idea')

    const outcome = await nodesReceivedBy(facilitatorSocket, authorSocket, nodes)

    expect(outcome).toEqual({ newNodes: sortedById(nodes) })
  })

  it('UC-048 · a facilitator\'s node update reaches the members with the same nodes', async () => {
    const member = participant(1)
    const { hackathon, group } = await aGroupWorkHackathon({ members: [member, participant(2)] })
    const memberSocket = await connectAs(member, { hackathon })
    const facilitatorSocket = await watching(facilitator(1), hackathon, group)
    const nodes = nodesLabelled('Facilitator idea')

    const outcome = await nodesReceivedBy(memberSocket, facilitatorSocket, nodes)

    expect(outcome).toEqual({ newNodes: sortedById(nodes) })
  })

  it('UC-048 · watching a group of another hackathon gets an error message', async () => {
    const { hackathon } = await aGroupWorkHackathon({ members: [participant(1), participant(2)] })
    const { group: groupElsewhere } = await aGroupWorkHackathon({ members: [participant(3)] })
    const facilitatorSocket = await connectAs(facilitator(1), { hackathon })

    const outcome = await errorMessageTypeOn(facilitatorSocket, (socket) => emit(socket, 'watch_group', groupElsewhere.id))

    expect(outcome).toEqual(REFUSAL)
  })

  it('UC-048 · after stopping watching, a facilitator no longer receives the group\'s node updates', async () => {
    const author = participant(1)
    const { hackathon, group } = await aGroupWorkHackathon({ members: [author, participant(2)] })
    const authorSocket = await connectAs(author, { hackathon })
    const facilitatorSocket = await watching(facilitator(1), hackathon, group)
    await emit(facilitatorSocket, 'stop_watching_group', group.id)

    const outcome = await nodesMissedBy(facilitatorSocket, authorSocket, nodesLabelled('Unseen idea'))

    expect(outcome).toEqual({ newNodes: NOT_RECEIVED })
  })
})

describe('UC-048 · IRQ-009 · the group map is stored', () => {
  it('UC-048 · IRQ-009 · after every socket leaves, the stored map has the last nodes a member sent', async () => {
    const [author, teammate] = [participant(1), participant(2)]
    const { hackathon, group } = await aGroupWorkHackathon({ members: [author, teammate], map: STARTING_MAP })
    const authorSocket = await connectAs(author, { hackathon })
    const teammateSocket = await connectAs(teammate, { hackathon })
    await emit(authorSocket, 'update_nodes', nodesLabelled('First draft'))
    const lastNodes = nodesLabelled('Final idea', 'Linked idea')
    await emit(authorSocket, 'update_nodes', lastNodes)

    authorSocket.disconnect()
    teammateSocket.disconnect()
    const outcome = await storedNodesOnceSaved(group, lastNodes)

    expect(outcome).toEqual({ status: 200, storedNodes: sortedById(lastNodes) })
  })

  it('UC-048 · IRQ-009 · BRU-025 · an evaluator\'s refused change is not stored', async () => {
    const [author, evaluator] = [participant(1), participant(13)]
    const { hackathon, group } = await aGroupWorkHackathon({ members: [author, participant(2)], evaluators: [evaluator], map: STARTING_MAP })
    const authorSocket = await connectAs(author, { hackathon })
    const evaluatorSocket = await watching(evaluator, hackathon, group)
    const membersNodes = nodesLabelled('Members idea')
    await emit(authorSocket, 'update_nodes', membersNodes)
    await emit(evaluatorSocket, 'update_nodes', nodesLabelled('Evaluator idea', 'Evaluator extra'))

    authorSocket.disconnect()
    evaluatorSocket.disconnect()
    const outcome = await storedNodesOnceSaved(group, membersNodes)

    expect(outcome).toEqual({ status: 200, storedNodes: sortedById(membersNodes) })
  })
})

describe('UC-048 · bad map requests', () => {
  it.each(MALFORMED_NODE_UPDATES)('UC-048 · a node update with %s gets an error message', async (_kind, malformed) => {
    const author = participant(1)
    const { hackathon } = await aGroupWorkHackathon({ members: [author, participant(2)] })
    const authorSocket = await connectAs(author, { hackathon })

    const outcome = await errorMessageTypeOn(authorSocket, (socket) => emit(socket, 'update_nodes', malformed))

    expect(outcome).toEqual(REFUSAL)
  })

  it.each(MALFORMED_NODE_UPDATES)('UC-048 · a node update with %s does not reach the other members', async (_kind, malformed) => {
    const [author, teammate] = [participant(1), participant(2)]
    const { hackathon } = await aGroupWorkHackathon({ members: [author, teammate] })
    const authorSocket = await connectAs(author, { hackathon })
    const teammateSocket = await connectAs(teammate, { hackathon })

    const outcome = await nodesMissedBy(teammateSocket, authorSocket, malformed)

    expect(outcome).toEqual({ newNodes: NOT_RECEIVED })
  })

  it.each(MALFORMED_NODE_UPDATES)('UC-048 · a node update with %s does not crash the server', async (_kind, malformed) => {
    const author = participant(1)
    const { hackathon } = await aGroupWorkHackathon({ members: [author, participant(2)] })
    const authorSocket = await connectAs(author, { hackathon })

    await emit(authorSocket, 'update_nodes', malformed)

    expect(await serverCrashes()).toEqual([])
  })

  it.each(EVENTS_NEEDING_A_HACKATHON)('UC-048 · %s from a socket that joined no hackathon gets an error message', async (_event, send) => {
    const member = participant(1)
    await aGroupWorkHackathon({ members: [member, participant(2)] })
    const socket = await connectAs(member)

    const outcome = await errorMessageTypeOn(socket, send)

    expect(outcome).toEqual(REFUSAL)
  })

  it.each(EVENTS_NEEDING_A_HACKATHON)('UC-048 · %s from a socket that joined no hackathon does not crash the server', async (_event, send) => {
    const member = participant(1)
    await aGroupWorkHackathon({ members: [member, participant(2)] })
    const socket = await connectAs(member)

    await send(socket)

    expect(await serverCrashes()).toEqual([])
  })
})
