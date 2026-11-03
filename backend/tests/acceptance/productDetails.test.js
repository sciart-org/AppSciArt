import { randomUUID } from 'node:crypto'
import { describe, it, expect, beforeAll } from 'vitest'
import {
  asGuest,
  as,
  administrator,
  designer,
  facilitator,
  participant,
  anAnnouncedEdition,
  aScientistOf,
  aSeed,
  aPublishedSeed,
  anEndedHackathon,
  aTeam,
  aFruit
} from '../support/index.js'

const SEED_REQUIRED_FIELDS = ['id', 'title', 'state', 'branchesOfKnowledge', 'seedPDF', 'mainImage', 'authors']

const SEED_OPTIONAL_FIELDS = ['videoLink', 'presentationLink', 'podcastLink', 'otherImages']

const FLOWER_REQUIRED_FIELDS = ['id', 'title', 'concept', 'state', 'seed', 'mainImage', 'authors']

const FLOWER_OPTIONAL_FIELDS = ['prototypeImages', 'inspirationImages', 'presentation', 'video']

const FRUIT_REQUIRED_FIELDS = ['id', 'title', 'state', 'authorVision', 'curatorVision', 'flower', 'seed', 'mainImage', 'authors']

const FRUIT_OPTIONAL_FIELDS = ['otherImages']

const RESTRICTED_FIELDS = ['driveLink', 'template']

const UNPUBLISHED_GUARANTEED_FIELDS = ['id', 'state', 'title']

const AUTHOR_FIELDS = ['id', 'name', 'surname']

const PUBLIC_FIELDS_BY_TYPE = {
  seed: [...SEED_REQUIRED_FIELDS, ...SEED_OPTIONAL_FIELDS],
  flower: [...FLOWER_REQUIRED_FIELDS, ...FLOWER_OPTIONAL_FIELDS],
  fruit: [...FRUIT_REQUIRED_FIELDS, ...FRUIT_OPTIONAL_FIELDS]
}

const FRUIT_FLOWER_REQUIRED_FIELDS = FLOWER_REQUIRED_FIELDS.filter((field) => field !== 'seed')

const FRUIT_FLOWER_PUBLIC_FIELDS = PUBLIC_FIELDS_BY_TYPE.flower.filter((field) => field !== 'seed')

const FRUIT_SEED_REQUIRED_FIELDS = [...SEED_REQUIRED_FIELDS, 'description']

const FRUIT_SEED_PUBLIC_FIELDS = [...PUBLIC_FIELDS_BY_TYPE.seed, 'description']

const PATH_BY_TYPE = {
  seed: '/seeds',
  flower: '/flowers',
  fruit: '/fruits'
}

const SEED_LINKS = {
  videoLink: 'https://video.example.org/seed-video',
  presentationLink: 'https://slides.example.org/seed-presentation',
  podcastLink: 'https://podcast.example.org/seed-podcast'
}

const FRUIT_SEED_DESCRIPTION = 'The seed as the fruit authors describe it'

const LINK = /^https?:\/\/\S+$/

const PRODUCT_TYPES = ['seed', 'flower', 'fruit']

const NON_STAFF_ACTORS = [
  ['guest', async () => asGuest()],
  ['participant', async () => as(participant(14))]
]

const STAFF_ACTORS = [
  ['designer', async () => as(designer(1))],
  ['facilitator', async () => as(facilitator(1))],
  ['administrator', async () => as(administrator(1))]
]

const SEED_AUTHOR = ['the seed author', async () => as(participant(1))]

const FLOWER_TEAM_MEMBERS = [
  ['a team member', async () => as(participant(3))],
  ['another team member', async () => as(participant(4))]
]

const FLOWER_TEAM_MEMBER_NOT_SEED_AUTHOR = ['a flower team member who is not a seed author', async () => as(participant(3))]

const FRUIT_AUTHOR = ['the fruit author', async () => as(participant(8))]

const EVALUATOR = ['an evaluator', async () => as(participant(13))]

const HACKATHON_EVALUATOR = ['an evaluator of its hackathon', async () => as(participant(13))]

const OTHER_HACKATHON_EVALUATOR = ['an evaluator of another hackathon', async () => as(participant(2))]

const OUTSIDER_ACTORS = [
  ['a participant', async () => as(participant(14))],
  ['an inspiring scientist of its edition', async () => as(participant(15))]
]

const outsidersByType = () => [
  ...withActors([...OUTSIDER_ACTORS, EVALUATOR], [['seed']]),
  ...withActors([...OUTSIDER_ACTORS, OTHER_HACKATHON_EVALUATOR], [['flower'], ['fruit']])
]

const SEED_PRIVILEGED_ACTORS = [...STAFF_ACTORS, SEED_AUTHOR]

const FLOWER_PRIVILEGED_ACTORS = [...STAFF_ACTORS, ...FLOWER_TEAM_MEMBERS]

const FRUIT_PRIVILEGED_ACTORS = [...STAFF_ACTORS, FRUIT_AUTHOR]

const UNPUBLISHED_PRODUCTS = [
  ['seed', 'IN_PROGRESS', 'inProgressSeed', () => participant(1)],
  ['seed', 'IN_REVIEW', 'inReviewSeed', () => participant(1)],
  ['flower', 'IN_BLANK', 'blankFlower', () => participant(5)],
  ['flower', 'IN_PROGRESS', 'inProgressFlower', () => participant(6)],
  ['flower', 'IN_REVIEW', 'inReviewFlower', () => participant(7)],
  ['fruit', 'IN_BLANK', 'blankFruit', () => participant(9)],
  ['fruit', 'IN_PROGRESS', 'inProgressFruit', () => participant(10)],
  ['fruit', 'IN_REVIEW', 'inReviewFruit', () => participant(11)]
]

const PUBLISHED_KEY_BY_TYPE = {
  seed: 'publishedSeed',
  flower: 'publishedFlower',
  fruit: 'publishedFruit'
}

const fieldsOutsideAllowed = (item, allowed) =>
  Object.keys(item).filter((key) => !allowed.includes(key))

const missingFields = (item, required) =>
  required.filter((field) => item[field] === undefined || item[field] === null)

const restrictedFieldsIn = (item) =>
  Object.keys(item).filter((key) => RESTRICTED_FIELDS.includes(key))

const sortedKeysOf = (item) => Object.keys(item).sort()

const asAuthor = ({ id, name, surname }) => ({ id, name, surname })

const byId = (a, b) => String(a.id).localeCompare(String(b.id))

const withSortedAuthors = (item) =>
  Array.isArray(item.authors) ? { ...item, authors: [...item.authors].sort(byId) } : item

const without = (item, field) => {
  const { [field]: _omitted, ...rest } = item
  return rest
}

const detailsOf = (api, type, product) => api.get(`${PATH_BY_TYPE[type]}/${product.id}`)

const withActors = (actors, rows) =>
  rows.flatMap((row) => actors.map(([role, client]) => [role, ...row, client]))

const SEED_KEY_BY_LABEL = {
  'without links': 'publishedSeed',
  'with links': 'linkedSeed'
}

const eachField = (fields, rows = [[]]) =>
  rows.flatMap((row) => fields.map((field) => [...row, field]))

const unpublishedOfType = (types) =>
  UNPUBLISHED_PRODUCTS
    .filter(([type]) => types.includes(type))
    .map(([type, state, key]) => [type, state, key])

const unpublishedWithStaffAndAuthor = () =>
  UNPUBLISHED_PRODUCTS.flatMap(([type, state, key, author]) => [
    ...STAFF_ACTORS.map(([role, client]) => [role, type, state, key, client]),
    ['its author', type, state, key, async () => as(author())]
  ])

let products

beforeAll(async () => {
  const edition = await anAnnouncedEdition()
  await aScientistOf(edition, participant(15))

  const publishedSeed = await aPublishedSeed({ edition, authors: [participant(1)] })
  const linkedSeed = await aPublishedSeed({ edition, authors: [participant(1)], ...SEED_LINKS })
  const inProgressSeed = await aSeed({ edition, authors: [participant(1)], state: 'IN_PROGRESS' })
  const inReviewSeed = await aSeed({ edition, authors: [participant(1)], state: 'IN_REVIEW' })

  const teamsHackathon = await anEndedHackathon({
    edition,
    seeds: [publishedSeed],
    participants: [participant(3), participant(4), participant(5), participant(6), participant(7)],
    evaluators: [participant(13)]
  })
  const publishedFlower = await aTeam({ hackathon: teamsHackathon, seed: publishedSeed, members: [participant(3), participant(4)], number: 1, flowerState: 'PUBLISHED' })
  const blankFlower = await aTeam({ hackathon: teamsHackathon, seed: publishedSeed, members: [participant(5)], number: 2, flowerState: 'IN_BLANK' })
  const inProgressFlower = await aTeam({ hackathon: teamsHackathon, seed: publishedSeed, members: [participant(6)], number: 3, flowerState: 'IN_PROGRESS' })
  const inReviewFlower = await aTeam({ hackathon: teamsHackathon, seed: publishedSeed, members: [participant(7)], number: 4, flowerState: 'IN_REVIEW' })

  await anEndedHackathon({ edition, evaluators: [participant(2)] })
  const publishedFruit = await aFruit({ hackathon: teamsHackathon, authors: [participant(8)], state: 'PUBLISHED', seedDescription: FRUIT_SEED_DESCRIPTION })
  const blankFruit = await aFruit({ hackathon: teamsHackathon, authors: [participant(9)], state: 'IN_BLANK' })
  const inProgressFruit = await aFruit({ hackathon: teamsHackathon, authors: [participant(10)], state: 'IN_PROGRESS' })
  const inReviewFruit = await aFruit({ hackathon: teamsHackathon, authors: [participant(11)], state: 'IN_REVIEW' })

  const privateFlowerHackathon = await anEndedHackathon({
    edition,
    isPrivate: true,
    seeds: [publishedSeed],
    participants: [participant(12)]
  })
  const privateFlower = await aTeam({ hackathon: privateFlowerHackathon, seed: publishedSeed, members: [participant(12)], flowerState: 'PUBLISHED' })
  const privateFruitHackathon = await anEndedHackathon({ edition, isPrivate: true })
  const privateFruit = await aFruit({ hackathon: privateFruitHackathon, authors: [participant(12)], state: 'PUBLISHED' })

  products = {
    publishedSeed,
    linkedSeed,
    inProgressSeed,
    inReviewSeed,
    publishedFlower,
    blankFlower,
    inProgressFlower,
    inReviewFlower,
    publishedFruit,
    blankFruit,
    inProgressFruit,
    inReviewFruit,
    privateFlower,
    privateFruit
  }
})

describe('UC-007 · access', () => {
  it.each(PRODUCT_TYPES)('UC-007 · guest gets the details of a published %s', async (type) => {
    const product = products[PUBLISHED_KEY_BY_TYPE[type]]

    const res = await detailsOf(asGuest(), type, product)

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(product.id)
  })

  it.each(withActors(NON_STAFF_ACTORS, [
    ['IN_PROGRESS', 'inProgressSeed'],
    ['IN_REVIEW', 'inReviewSeed']
  ]))('UC-007 · BRU-018 · %s asking for an unpublished %s seed gets 404', async (_role, _state, key, client) => {
    const api = await client()

    const res = await detailsOf(api, 'seed', products[key])

    expect(res.status).toBe(404)
  })

  it.each(withActors(NON_STAFF_ACTORS, UNPUBLISHED_PRODUCTS
    .filter(([type]) => type !== 'seed')
    .map(([type, state, key]) => [type, state, key])
  ))('UC-007 · %s asking for an unpublished %s in state %s gets 404', async (_role, type, _state, key, client) => {
    const api = await client()

    const res = await detailsOf(api, type, products[key])

    expect(res.status).toBe(404)
  })

  it.each(UNPUBLISHED_PRODUCTS.flatMap(([type, state, key]) =>
    STAFF_ACTORS.map(([role, client]) => [role, type, state, key, client])
  ))('UC-007 · %s gets the details of an unpublished %s in state %s', async (_role, type, _state, key, client) => {
    const api = await client()

    const res = await detailsOf(api, type, products[key])

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(products[key].id)
  })

  it.each(UNPUBLISHED_PRODUCTS)('UC-007 · the author of an unpublished %s in state %s gets its details', async (type, _state, key, author) => {
    const api = await as(author())

    const res = await detailsOf(api, type, products[key])

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(products[key].id)
  })

  it.each(unpublishedOfType(['flower', 'fruit']))('UC-007 · an evaluator of its hackathon gets the details of an unpublished %s in state %s', async (type, _state, key) => {
    const api = await HACKATHON_EVALUATOR[1]()

    const res = await detailsOf(api, type, products[key])

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(products[key].id)
  })

  it.each(unpublishedOfType(['flower', 'fruit']))('UC-007 · an evaluator of its hackathon gets an unpublished %s in state %s with no field outside the public set plus driveLink and template', async (type, _state, key) => {
    const api = await HACKATHON_EVALUATOR[1]()

    const res = await detailsOf(api, type, products[key])

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body, [...PUBLIC_FIELDS_BY_TYPE[type], ...RESTRICTED_FIELDS])).toEqual([])
  })

  it.each(unpublishedOfType(['flower', 'fruit']))('UC-007 · an evaluator of its hackathon gets an unpublished %s in state %s with its id, state and title', async (type, state, key) => {
    const product = products[key]
    const api = await HACKATHON_EVALUATOR[1]()

    const res = await detailsOf(api, type, product)

    expect(res.status).toBe(200)
    expect(UNPUBLISHED_GUARANTEED_FIELDS.filter((field) => !(field in res.body))).toEqual([])
    expect(res.body).toMatchObject({ id: product.id, state, title: product.title })
  })

  it.each(unpublishedOfType(['seed']))('UC-007 · BRU-018 · an evaluator asking for an unpublished %s in state %s gets 404', async (type, _state, key) => {
    const api = await EVALUATOR[1]()

    const res = await detailsOf(api, type, products[key])

    expect(res.status).toBe(404)
  })

  it.each(unpublishedOfType(['flower', 'fruit']))('UC-007 · an evaluator of another hackathon asking for an unpublished %s in state %s gets 404', async (type, _state, key) => {
    const api = await OTHER_HACKATHON_EVALUATOR[1]()

    const res = await detailsOf(api, type, products[key])

    expect(res.status).toBe(404)
  })

  it.each(eachField(RESTRICTED_FIELDS, [['flower'], ['fruit']]))('UC-007 · an evaluator of its hackathon gets a published %s with its %s', async (type, field) => {
    const api = await HACKATHON_EVALUATOR[1]()

    const res = await detailsOf(api, type, products[PUBLISHED_KEY_BY_TYPE[type]])

    expect(res.status).toBe(200)
    expect(missingFields(res.body, [field])).toEqual([])
  })

  it.each(PRODUCT_TYPES)('UC-007 · asking for an unknown %s gets 404', async (type) => {
    const res = await detailsOf(asGuest(), type, { id: randomUUID() })

    expect(res.status).toBe(404)
  })

  it.each([
    ['flower', 'privateFlower'],
    ['fruit', 'privateFruit']
  ])('UC-007 · guest gets the details of a published %s of a private hackathon', async (type, key) => {
    const res = await detailsOf(asGuest(), type, products[key])

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(products[key].id)
  })
})

describe('UC-007 · IRQ-002 · seed fields', () => {
  it.each(withActors(NON_STAFF_ACTORS, [
    ['without links', 'publishedSeed'],
    ['with links', 'linkedSeed']
  ]))('UC-007 · IRQ-002 · %s gets a published seed %s with no field outside the public set', async (_role, _label, key, client) => {
    const api = await client()

    const res = await detailsOf(api, 'seed', products[key])

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body, PUBLIC_FIELDS_BY_TYPE.seed)).toEqual([])
  })

  it.each(withActors(NON_STAFF_ACTORS, eachField(SEED_REQUIRED_FIELDS, [
    ['without links'],
    ['with links']
  ]).map(([label, field]) => [label, field, SEED_KEY_BY_LABEL[label]])))('UC-007 · IRQ-002 · %s gets a published seed %s with the required field %s', async (_role, _label, field, key, client) => {
    const api = await client()

    const res = await detailsOf(api, 'seed', products[key])

    expect(res.status).toBe(200)
    expect(missingFields(res.body, [field])).toEqual([])
  })

  it.each(NON_STAFF_ACTORS)('UC-007 · IRQ-002 · %s gets a published seed whose seedPDF is a link', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'seed', products.publishedSeed)

    expect(res.status).toBe(200)
    expect(res.body.seedPDF).toMatch(LINK)
  })

  it.each(NON_STAFF_ACTORS)('UC-007 · IRQ-002 · %s gets a published seed whose mainImage is a link', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'seed', products.publishedSeed)

    expect(res.status).toBe(200)
    expect(res.body.mainImage).toMatch(LINK)
  })

  it.each(Object.keys(SEED_LINKS))('UC-007 · IRQ-002 · a seed stored with a %s returns that link', async (field) => {
    const res = await detailsOf(asGuest(), 'seed', products.linkedSeed)

    expect(res.status).toBe(200)
    expect(res.body[field]).toBe(SEED_LINKS[field])
  })

  it.each(SEED_PRIVILEGED_ACTORS)('UC-007 · IRQ-002 · %s gets a published seed with no field outside the public set plus driveLink and template', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'seed', products.publishedSeed)

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body, [...PUBLIC_FIELDS_BY_TYPE.seed, ...RESTRICTED_FIELDS])).toEqual([])
  })

  it.each(withActors(SEED_PRIVILEGED_ACTORS, eachField([...SEED_REQUIRED_FIELDS, ...RESTRICTED_FIELDS])))('UC-007 · IRQ-002 · %s gets a published seed with the required field %s', async (_role, field, client) => {
    const api = await client()

    const res = await detailsOf(api, 'seed', products.publishedSeed)

    expect(res.status).toBe(200)
    expect(missingFields(res.body, [field])).toEqual([])
  })
})

describe('UC-007 · IRQ-003 · flower fields', () => {
  it.each(NON_STAFF_ACTORS)('UC-007 · IRQ-003 · %s gets a published flower with no field outside the public set', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'flower', products.publishedFlower)

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body, PUBLIC_FIELDS_BY_TYPE.flower)).toEqual([])
  })

  it.each(withActors(NON_STAFF_ACTORS, eachField(FLOWER_REQUIRED_FIELDS)))('UC-007 · IRQ-003 · %s gets a published flower with the required field %s', async (_role, field, client) => {
    const api = await client()

    const res = await detailsOf(api, 'flower', products.publishedFlower)

    expect(res.status).toBe(200)
    expect(missingFields(res.body, [field])).toEqual([])
  })

  it.each(NON_STAFF_ACTORS)('UC-007 · IRQ-003 · %s gets a published flower whose mainImage is a link', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'flower', products.publishedFlower)

    expect(res.status).toBe(200)
    expect(res.body.mainImage).toMatch(LINK)
  })

  it.each([
    ...NON_STAFF_ACTORS,
    ...STAFF_ACTORS,
    SEED_AUTHOR,
    FLOWER_TEAM_MEMBER_NOT_SEED_AUTHOR
  ])('UC-007 · IRQ-003 · for %s the flower seed equals the details of its original seed', async (_role, client) => {
    const api = await client()

    const flower = await detailsOf(api, 'flower', products.publishedFlower)
    const seed = await detailsOf(api, 'seed', products.publishedSeed)

    expect(flower.status).toBe(200)
    expect(seed.status).toBe(200)
    expect(withSortedAuthors(flower.body.seed ?? {})).toEqual(withSortedAuthors(seed.body))
  })

  it.each(NON_STAFF_ACTORS)('UC-007 · IRQ-003 · %s gets a flower seed with no field outside the public seed set', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'flower', products.publishedFlower)

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body.seed ?? {}, PUBLIC_FIELDS_BY_TYPE.seed)).toEqual([])
  })

  it.each(withActors(NON_STAFF_ACTORS, eachField(SEED_REQUIRED_FIELDS)))('UC-007 · IRQ-003 · %s gets a flower seed with the required seed field %s', async (_role, field, client) => {
    const api = await client()

    const res = await detailsOf(api, 'flower', products.publishedFlower)

    expect(res.status).toBe(200)
    expect(missingFields(res.body.seed ?? {}, [field])).toEqual([])
  })

  it.each(SEED_PRIVILEGED_ACTORS)('UC-007 · IRQ-003 · %s gets a flower seed with no field outside the public seed set plus driveLink and template', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'flower', products.publishedFlower)

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body.seed ?? {}, [...PUBLIC_FIELDS_BY_TYPE.seed, ...RESTRICTED_FIELDS])).toEqual([])
  })

  it.each(withActors(SEED_PRIVILEGED_ACTORS, eachField([...SEED_REQUIRED_FIELDS, ...RESTRICTED_FIELDS])))('UC-007 · IRQ-003 · %s gets a flower seed with the required seed field %s', async (_role, field, client) => {
    const api = await client()

    const res = await detailsOf(api, 'flower', products.publishedFlower)

    expect(res.status).toBe(200)
    expect(missingFields(res.body.seed ?? {}, [field])).toEqual([])
  })

  it('UC-007 · IRQ-003 · a flower team member who is not a seed author gets a flower seed with no driveLink and no template', async () => {
    const api = await FLOWER_TEAM_MEMBER_NOT_SEED_AUTHOR[1]()

    const res = await detailsOf(api, 'flower', products.publishedFlower)

    expect(res.status).toBe(200)
    expect(restrictedFieldsIn(res.body.seed ?? {})).toEqual([])
  })

  it.each(FLOWER_PRIVILEGED_ACTORS)('UC-007 · IRQ-003 · %s gets a published flower with no field outside the public set plus driveLink and template', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'flower', products.publishedFlower)

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body, [...PUBLIC_FIELDS_BY_TYPE.flower, ...RESTRICTED_FIELDS])).toEqual([])
  })

  it.each(withActors(FLOWER_PRIVILEGED_ACTORS, eachField([...FLOWER_REQUIRED_FIELDS, ...RESTRICTED_FIELDS])))('UC-007 · IRQ-003 · %s gets a published flower with the required field %s', async (_role, field, client) => {
    const api = await client()

    const res = await detailsOf(api, 'flower', products.publishedFlower)

    expect(res.status).toBe(200)
    expect(missingFields(res.body, [field])).toEqual([])
  })
})

describe('UC-007 · IRQ-004 · fruit fields', () => {
  it.each(NON_STAFF_ACTORS)('UC-007 · IRQ-004 · %s gets a published fruit with no field outside the public set', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body, PUBLIC_FIELDS_BY_TYPE.fruit)).toEqual([])
  })

  it.each(withActors(NON_STAFF_ACTORS, eachField(FRUIT_REQUIRED_FIELDS)))('UC-007 · IRQ-004 · %s gets a published fruit with the required field %s', async (_role, field, client) => {
    const api = await client()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(missingFields(res.body, [field])).toEqual([])
  })

  it.each(NON_STAFF_ACTORS)('UC-007 · IRQ-004 · %s gets a published fruit whose mainImage is a link', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(res.body.mainImage).toMatch(LINK)
  })

  it.each([
    ...NON_STAFF_ACTORS,
    ...FRUIT_PRIVILEGED_ACTORS
  ])('UC-007 · IRQ-004 · for %s the fruit flower equals the details of its flower without its seed', async (_role, client) => {
    const api = await client()

    const fruit = await detailsOf(api, 'fruit', products.publishedFruit)
    const flower = await detailsOf(api, 'flower', products.publishedFruit.flower)

    expect(fruit.status).toBe(200)
    expect(flower.status).toBe(200)
    expect(withSortedAuthors(fruit.body.flower ?? {})).toEqual(withSortedAuthors(without(flower.body, 'seed')))
  })

  it.each(NON_STAFF_ACTORS)('UC-007 · IRQ-004 · %s gets a fruit flower with no field outside the public flower set without seed', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body.flower ?? {}, FRUIT_FLOWER_PUBLIC_FIELDS)).toEqual([])
  })

  it.each(withActors(NON_STAFF_ACTORS, eachField(FRUIT_FLOWER_REQUIRED_FIELDS)))('UC-007 · IRQ-004 · %s gets a fruit flower with the required flower field %s', async (_role, field, client) => {
    const api = await client()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(missingFields(res.body.flower ?? {}, [field])).toEqual([])
  })

  it.each(FRUIT_PRIVILEGED_ACTORS)('UC-007 · IRQ-004 · %s gets a fruit flower with no field outside the public flower set without seed plus driveLink and template', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body.flower ?? {}, [...FRUIT_FLOWER_PUBLIC_FIELDS, ...RESTRICTED_FIELDS])).toEqual([])
  })

  it.each(withActors(FRUIT_PRIVILEGED_ACTORS, eachField([...FRUIT_FLOWER_REQUIRED_FIELDS, ...RESTRICTED_FIELDS])))('UC-007 · IRQ-004 · %s gets a fruit flower with the required flower field %s', async (_role, field, client) => {
    const api = await client()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(missingFields(res.body.flower ?? {}, [field])).toEqual([])
  })

  it.each([
    ...NON_STAFF_ACTORS,
    ...FRUIT_PRIVILEGED_ACTORS
  ])('UC-007 · IRQ-004 · for %s the fruit seed equals the details of its flower seed plus a description', async (_role, client) => {
    const api = await client()

    const fruit = await detailsOf(api, 'fruit', products.publishedFruit)
    const seed = await detailsOf(api, 'seed', products.publishedFruit.seed)

    expect(fruit.status).toBe(200)
    expect(seed.status).toBe(200)
    expect(withSortedAuthors(without(fruit.body.seed ?? {}, 'description'))).toEqual(withSortedAuthors(seed.body))
  })

  it('UC-007 · IRQ-004 · the fruit seed description is the description stored for the fruit', async () => {
    const res = await detailsOf(asGuest(), 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect({ description: res.body.seed?.description }).toEqual({ description: FRUIT_SEED_DESCRIPTION })
  })

  it.each(NON_STAFF_ACTORS)('UC-007 · IRQ-004 · %s gets a fruit seed with no field outside the public seed set plus description', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body.seed ?? {}, FRUIT_SEED_PUBLIC_FIELDS)).toEqual([])
  })

  it.each(withActors(NON_STAFF_ACTORS, eachField(FRUIT_SEED_REQUIRED_FIELDS)))('UC-007 · IRQ-004 · %s gets a fruit seed with the required seed field %s', async (_role, field, client) => {
    const api = await client()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(missingFields(res.body.seed ?? {}, [field])).toEqual([])
  })

  it.each(STAFF_ACTORS)('UC-007 · IRQ-004 · %s gets a fruit seed with no field outside the public seed set plus description, driveLink and template', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body.seed ?? {}, [...FRUIT_SEED_PUBLIC_FIELDS, ...RESTRICTED_FIELDS])).toEqual([])
  })

  it.each(withActors(STAFF_ACTORS, eachField([...FRUIT_SEED_REQUIRED_FIELDS, ...RESTRICTED_FIELDS])))('UC-007 · IRQ-004 · %s gets a fruit seed with the required seed field %s', async (_role, field, client) => {
    const api = await client()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(missingFields(res.body.seed ?? {}, [field])).toEqual([])
  })

  it('UC-007 · IRQ-004 · the fruit author who is not a seed author gets a fruit seed with no driveLink and no template', async () => {
    const api = await FRUIT_AUTHOR[1]()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(restrictedFieldsIn(res.body.seed ?? {})).toEqual([])
  })

  it.each(FRUIT_PRIVILEGED_ACTORS)('UC-007 · IRQ-004 · %s gets a published fruit with no field outside the public set plus driveLink and template', async (_role, client) => {
    const api = await client()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body, [...PUBLIC_FIELDS_BY_TYPE.fruit, ...RESTRICTED_FIELDS])).toEqual([])
  })

  it.each(withActors(FRUIT_PRIVILEGED_ACTORS, eachField([...FRUIT_REQUIRED_FIELDS, ...RESTRICTED_FIELDS])))('UC-007 · IRQ-004 · %s gets a published fruit with the required field %s', async (_role, field, client) => {
    const api = await client()

    const res = await detailsOf(api, 'fruit', products.publishedFruit)

    expect(res.status).toBe(200)
    expect(missingFields(res.body, [field])).toEqual([])
  })
})

describe('UC-007 · every product type', () => {
  it.each(PRODUCT_TYPES)('UC-007 · each author of a published %s is exactly id, name and surname', async (type) => {
    const res = await detailsOf(asGuest(), type, products[PUBLISHED_KEY_BY_TYPE[type]])

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.authors)).toBe(true)
    expect(res.body.authors.map(sortedKeysOf)).toEqual(res.body.authors.map(() => [...AUTHOR_FIELDS].sort()))
  })

  it.each([
    ['seed', 'its inspiring scientists', () => [participant(1)]],
    ['flower', 'its co-creation team members', () => [participant(3), participant(4)]],
    ['fruit', 'its own authors', () => [participant(8)]]
  ])('UC-007 · the authors of a published %s are %s', async (type, _label, expectedAuthors) => {
    const res = await detailsOf(asGuest(), type, products[PUBLISHED_KEY_BY_TYPE[type]])

    expect(res.status).toBe(200)
    expect((res.body.authors ?? []).map(asAuthor).sort(byId)).toEqual(expectedAuthors().map(asAuthor).sort(byId))
  })

  it.each(outsidersByType())('UC-007 · %s who is not an author of a published %s gets no driveLink and no template', async (_role, type, client) => {
    const api = await client()

    const res = await detailsOf(api, type, products[PUBLISHED_KEY_BY_TYPE[type]])

    expect(res.status).toBe(200)
    expect(restrictedFieldsIn(res.body)).toEqual([])
  })

  it.each(unpublishedWithStaffAndAuthor())('UC-007 · %s gets an unpublished %s in state %s with no field outside the allowed set', async (_role, type, _state, key, client) => {
    const api = await client()

    const res = await detailsOf(api, type, products[key])

    expect(res.status).toBe(200)
    expect(fieldsOutsideAllowed(res.body, [...PUBLIC_FIELDS_BY_TYPE[type], ...RESTRICTED_FIELDS])).toEqual([])
  })

  it.each(unpublishedWithStaffAndAuthor())('UC-007 · %s gets an unpublished %s in state %s with its id, state and title', async (_role, type, state, key, client) => {
    const product = products[key]
    const api = await client()

    const res = await detailsOf(api, type, product)

    expect(res.status).toBe(200)
    expect(UNPUBLISHED_GUARANTEED_FIELDS.filter((field) => !(field in res.body))).toEqual([])
    expect(res.body).toMatchObject({ id: product.id, state, title: product.title })
  })
})
