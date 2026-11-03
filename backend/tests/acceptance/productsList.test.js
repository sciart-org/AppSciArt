import { randomUUID } from 'node:crypto'
import { describe, it, expect, beforeAll } from 'vitest'
import {
  asGuest,
  as,
  administrator,
  designer,
  facilitator,
  participant,
  aNotAnnouncedEdition,
  anAnnouncedEdition,
  aClosedEdition,
  aPublishedEdition,
  aSeed,
  aPublishedSeed,
  aSeedOfEdition,
  anEndedHackathon,
  anEvaluatorOf,
  aTeam,
  aFruit
} from '../support/index.js'

const ALLOWED_SEED_ITEM_FIELDS = ['id', 'state', 'title', 'mainImage', 'branchesOfKnowledge', 'authors']

const ALLOWED_FLOWER_ITEM_FIELDS = ['id', 'state', 'title', 'mainImage', 'authors']

const ALLOWED_FRUIT_ITEM_FIELDS = ['id', 'state', 'title', 'mainImage', 'authors']

const ALLOWED_AUTHOR_FIELDS = ['id', 'name', 'surname']

const LINK = /^https?:\/\/\S+$/

const PRODUCT_TYPES = [
  { type: 'seeds', path: '/seeds', irq: 'IRQ-002', fields: ALLOWED_SEED_ITEM_FIELDS },
  { type: 'flowers', path: '/flowers', irq: 'IRQ-003', fields: ALLOWED_FLOWER_ITEM_FIELDS },
  { type: 'fruits', path: '/fruits', irq: 'IRQ-004', fields: ALLOWED_FRUIT_ITEM_FIELDS }
]

const NON_SEED_TYPES = PRODUCT_TYPES.filter(({ type }) => type !== 'seeds')

const FLOWERS_EVALUATOR = () => participant(14)

const FRUITS_EVALUATOR = () => participant(13)

const EVALUATOR_BY_TYPE = { flowers: FLOWERS_EVALUATOR, fruits: FRUITS_EVALUATOR }

const OTHER_EVALUATOR_BY_TYPE = { flowers: FRUITS_EVALUATOR, fruits: FLOWERS_EVALUATOR }

const EVALUATED_TYPES = NON_SEED_TYPES.map((productType) => ({
  ...productType,
  evaluator: EVALUATOR_BY_TYPE[productType.type],
  otherEvaluator: OTHER_EVALUATOR_BY_TYPE[productType.type]
}))

const NON_STAFF_ACTORS = [
  { role: 'guest', client: async () => asGuest() },
  { role: 'participant', client: async () => as(participant(15)) }
]

const STAFF_ACTORS = [
  { role: 'designer', client: async () => as(designer(1)) },
  { role: 'facilitator', client: async () => as(facilitator(1)) },
  { role: 'administrator', client: async () => as(administrator(1)) }
]

const EVERY_ACTOR = [...NON_STAFF_ACTORS, ...STAFF_ACTORS]

const fieldsOutsideAllowed = (item, allowed) =>
  Object.keys(item).filter((key) => !allowed.includes(key))

const missingRequiredFields = (item, required) =>
  required.filter((key) => !Object.hasOwn(item, key))

const itemsWithFieldsOutsideAllowed = (items, allowed) =>
  items
    .map((item) => ({ id: item.id, outside: fieldsOutsideAllowed(item, allowed) }))
    .filter(({ outside }) => outside.length > 0)

const itemsMissingRequiredFields = (items, required) =>
  items
    .map((item) => ({ id: item.id, missing: missingRequiredFields(item, required) }))
    .filter(({ missing }) => missing.length > 0)

const idsOf = (items) => items.map((item) => item.id)

const sortedKeysOf = (item) => Object.keys(item).sort()

const asAuthor = ({ id, name, surname }) => ({ id, name, surname })

const byId = (a, b) => String(a.id).localeCompare(String(b.id))

const listOf = (api, path, edition) => api.get(path).query({ editionId: edition.id })

const forEveryTypeAndActor = (types, actors) =>
  types.flatMap((productType) => actors.map((actor) => ({ ...productType, ...actor })))

const itemsWithMainImageNotALink = (items) =>
  items.filter((item) => !LINK.test(String(item.mainImage))).map(({ id, mainImage }) => ({ id, mainImage }))

const authorsOf = (items) =>
  items.flatMap((item) => (Array.isArray(item.authors) ? item.authors : []).map((author) => ({ productId: item.id, author })))

const authorsOutsideAllowed = (items) =>
  authorsOf(items)
    .map(({ productId, author }) => ({ productId, outside: fieldsOutsideAllowed(author, ALLOWED_AUTHOR_FIELDS) }))
    .filter(({ outside }) => outside.length > 0)

const authorsMissingFields = (items) =>
  authorsOf(items)
    .map(({ productId, author }) => ({ productId, missing: missingRequiredFields(author, ALLOWED_AUTHOR_FIELDS) }))
    .filter(({ missing }) => missing.length > 0)

const itemsWithoutAuthorList = (items) =>
  items.filter((item) => !Array.isArray(item.authors)).map(({ id, authors }) => ({ id, authors }))

let announced, closed, published, otherAnnounced, notAnnounced
let products

beforeAll(async () => {
  announced = await anAnnouncedEdition()
  closed = await aClosedEdition()
  published = await aPublishedEdition()
  otherAnnounced = await anAnnouncedEdition()
  notAnnounced = await aNotAnnouncedEdition()

  const branches = ['Biology', 'Ecology']

  const publishedSeed = await aPublishedSeed({ edition: announced, authors: [participant(1)], branchesOfKnowledge: branches })
  const inProgressSeed = await aSeed({ edition: announced, authors: [participant(2)], state: 'IN_PROGRESS', branchesOfKnowledge: branches })
  const inReviewSeed = await aSeed({ edition: announced, authors: [participant(2)], state: 'IN_REVIEW', branchesOfKnowledge: branches })

  const teamsHackathon = await anEndedHackathon({
    edition: announced,
    seeds: [publishedSeed],
    participants: [participant(3), participant(4), participant(5), participant(6), participant(7)]
  })
  const publishedFlower = await aTeam({ hackathon: teamsHackathon, seed: publishedSeed, members: [participant(3), participant(4)], number: 1, flowerState: 'PUBLISHED' })
  const blankFlower = await aTeam({ hackathon: teamsHackathon, seed: publishedSeed, members: [participant(5)], number: 2, flowerState: 'IN_BLANK' })
  const inProgressFlower = await aTeam({ hackathon: teamsHackathon, seed: publishedSeed, members: [participant(6)], number: 3, flowerState: 'IN_PROGRESS' })
  const inReviewFlower = await aTeam({ hackathon: teamsHackathon, seed: publishedSeed, members: [participant(7)], number: 4, flowerState: 'IN_REVIEW' })
  await anEvaluatorOf(teamsHackathon, FLOWERS_EVALUATOR())

  const fruitsHackathon = await anEndedHackathon({ edition: announced })
  const publishedFruit = await aFruit({ hackathon: fruitsHackathon, authors: [participant(8)], state: 'PUBLISHED' })
  const blankFruit = await aFruit({ hackathon: fruitsHackathon, authors: [participant(9)], state: 'IN_BLANK' })
  const inProgressFruit = await aFruit({ hackathon: fruitsHackathon, authors: [participant(10)], state: 'IN_PROGRESS' })
  const inReviewFruit = await aFruit({ hackathon: fruitsHackathon, authors: [participant(11)], state: 'IN_REVIEW' })
  await anEvaluatorOf(fruitsHackathon, FRUITS_EVALUATOR())

  const privateFlowerHackathon = await anEndedHackathon({
    edition: announced,
    isPrivate: true,
    seeds: [publishedSeed],
    participants: [participant(12)]
  })
  const privateFlower = await aTeam({ hackathon: privateFlowerHackathon, seed: publishedSeed, members: [participant(12)], flowerState: 'PUBLISHED' })
  const privateFruitHackathon = await anEndedHackathon({ edition: announced, isPrivate: true })
  const privateFruit = await aFruit({ hackathon: privateFruitHackathon, authors: [participant(11)], state: 'PUBLISHED' })

  const closedSeed = await aPublishedSeed({ edition: closed, authors: [participant(1)] })
  const closedHackathon = await anEndedHackathon({ edition: closed, seeds: [closedSeed], participants: [participant(12)] })
  const closedFlower = await aTeam({ hackathon: closedHackathon, seed: closedSeed, members: [participant(12)], flowerState: 'PUBLISHED' })
  const closedFruit = await aFruit({ hackathon: closedHackathon, authors: [participant(11)], state: 'PUBLISHED' })

  const publishedEditionSeed = await aPublishedSeed({ edition: published, authors: [participant(1)] })
  const publishedEditionHackathon = await anEndedHackathon({ edition: published, seeds: [publishedEditionSeed], participants: [participant(12)] })
  const publishedEditionFlower = await aTeam({ hackathon: publishedEditionHackathon, seed: publishedEditionSeed, members: [participant(12)], flowerState: 'PUBLISHED' })
  const publishedEditionFruit = await aFruit({ hackathon: publishedEditionHackathon, authors: [participant(11)], state: 'PUBLISHED' })

  const otherFruit = await aFruit({ edition: otherAnnounced, authors: [participant(11)], state: 'PUBLISHED' })

  await aSeed({ edition: notAnnounced, authors: [participant(1)] })

  const sharedSeed = await aPublishedSeed({ edition: closed, authors: [participant(1)] })
  await aSeedOfEdition(announced, sharedSeed)

  products = {
    announced: {
      seeds: { published: publishedSeed, unpublished: [inProgressSeed, inReviewSeed] },
      flowers: { published: publishedFlower, unpublished: [blankFlower, inProgressFlower, inReviewFlower] },
      fruits: { published: publishedFruit, unpublished: [blankFruit, inProgressFruit, inReviewFruit] }
    },
    closed: { seeds: closedSeed, flowers: closedFlower, fruits: closedFruit },
    published: { seeds: publishedEditionSeed, flowers: publishedEditionFlower, fruits: publishedEditionFruit },
    other: { seeds: otherFruit.seed, flowers: otherFruit.flower, fruits: otherFruit },
    private: { flowers: privateFlower, fruits: privateFruit },
    sharedSeed
  }
})

describe('UC-006 · selecting the edition', () => {
  it.each(PRODUCT_TYPES)('UC-006 · guest lists the published $type of an announced edition', async ({ type, path }) => {
    const expected = products.announced[type].published

    const res = await listOf(asGuest(), path, announced)

    expect(res.status).toBe(200)
    expect(idsOf(res.body)).toContain(expected.id)
  })

  it.each(['closed', 'published'].flatMap((editionState) => PRODUCT_TYPES.map((productType) => ({ ...productType, editionState }))))(
    'UC-006 · guest lists the published $type of a $editionState edition',
    async ({ type, path, editionState }) => {
      const edition = editionState === 'closed' ? closed : published
      const expected = products[editionState][type]

      const res = await listOf(asGuest(), path, edition)

      expect(res.status).toBe(200)
      expect(idsOf(res.body)).toContain(expected.id)
    }
  )

  it.each(forEveryTypeAndActor(PRODUCT_TYPES, NON_STAFF_ACTORS))('UC-006 · $role listing the $type of a not-announced edition gets 404', async ({ path, client }) => {
    const api = await client()

    const res = await listOf(api, path, notAnnounced)

    expect(res.status).toBe(404)
  })

  it.each(PRODUCT_TYPES)('UC-006 · listing $type without editionId gets 400', async ({ path }) => {
    const res = await asGuest().get(path)

    expect(res.status).toBe(400)
  })

  it.each(PRODUCT_TYPES)('UC-006 · listing $type of an unknown edition gets 404', async ({ path }) => {
    const res = await asGuest().get(path).query({ editionId: randomUUID() })

    expect(res.status).toBe(404)
  })

  it.each(PRODUCT_TYPES)('UC-006 · $type of other editions are not listed', async ({ type, path }) => {
    const otherEditionIds = [products.other[type].id, products.closed[type].id, products.published[type].id]

    const res = await listOf(asGuest(), path, announced)

    expect(res.status).toBe(200)
    expect(idsOf(res.body).filter((id) => otherEditionIds.includes(id))).toEqual([])
  })

  it('UC-006 · IRQ-002 · a seed that belongs to two editions is listed in the first one', async () => {
    const res = await listOf(asGuest(), '/seeds', closed)

    expect(res.status).toBe(200)
    expect(idsOf(res.body)).toContain(products.sharedSeed.id)
  })

  it('UC-006 · IRQ-002 · a seed that belongs to two editions is listed in the second one', async () => {
    const res = await listOf(asGuest(), '/seeds', announced)

    expect(res.status).toBe(200)
    expect(idsOf(res.body)).toContain(products.sharedSeed.id)
  })
})

describe('UC-006 · which products are listed', () => {
  it.each(NON_STAFF_ACTORS)('UC-006 · BRU-018 · $role does not get unpublished seeds', async ({ client }) => {
    const api = await client()
    const unpublishedIds = idsOf(products.announced.seeds.unpublished)

    const res = await listOf(api, '/seeds', announced)

    expect(res.status).toBe(200)
    expect(idsOf(res.body).filter((id) => unpublishedIds.includes(id))).toEqual([])
  })

  it.each(forEveryTypeAndActor(NON_SEED_TYPES, NON_STAFF_ACTORS))('UC-006 · $irq · $role does not get unpublished $type', async ({ type, path, client }) => {
    const api = await client()
    const unpublishedIds = idsOf(products.announced[type].unpublished)

    const res = await listOf(api, path, announced)

    expect(res.status).toBe(200)
    expect(idsOf(res.body).filter((id) => unpublishedIds.includes(id))).toEqual([])
  })

  it('UC-006 · BRU-018 · a seed author does not get their own unpublished seeds in the list', async () => {
    const api = await as(participant(2))
    const unpublishedIds = idsOf(products.announced.seeds.unpublished)

    const res = await listOf(api, '/seeds', announced)

    expect(res.status).toBe(200)
    expect(idsOf(res.body).filter((id) => unpublishedIds.includes(id))).toEqual([])
  })

  it.each(forEveryTypeAndActor(PRODUCT_TYPES, STAFF_ACTORS))('UC-006 · $irq · $role gets the $type of every state', async ({ type, path, client }) => {
    const api = await client()
    const { published: publishedProduct, unpublished } = products.announced[type]

    const res = await listOf(api, path, announced)

    expect(res.status).toBe(200)
    expect(idsOf(res.body)).toEqual(expect.arrayContaining(idsOf([publishedProduct, ...unpublished])))
  })

  it.each(NON_SEED_TYPES)('UC-006 · $irq · published $type of a private hackathon are listed for a guest', async ({ type, path }) => {
    const res = await listOf(asGuest(), path, announced)

    expect(res.status).toBe(200)
    expect(idsOf(res.body)).toContain(products.private[type].id)
  })

  it.each(EVALUATED_TYPES)('UC-006 · $irq · the evaluator of a hackathon gets its $type of every state', async ({ type, path, evaluator }) => {
    const api = await as(evaluator())
    const { published: publishedProduct, unpublished } = products.announced[type]
    const expectedIds = idsOf([publishedProduct, ...unpublished])

    const res = await listOf(api, path, announced)

    expect(res.status).toBe(200)
    expect(expectedIds.filter((id) => !idsOf(res.body).includes(id))).toEqual([])
  })

  it.each(EVALUATED_TYPES)('UC-006 · $irq · the evaluator of a hackathon gets $type items with no field outside the allowed set', async ({ path, fields, evaluator }) => {
    const api = await as(evaluator())

    const res = await listOf(api, path, announced)

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    expect(itemsWithFieldsOutsideAllowed(res.body, fields)).toEqual([])
  })

  it.each(EVALUATED_TYPES)('UC-006 · $irq · the evaluator of a hackathon gets $type items with every required field', async ({ path, fields, evaluator }) => {
    const api = await as(evaluator())

    const res = await listOf(api, path, announced)

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    expect(itemsMissingRequiredFields(res.body, fields)).toEqual([])
  })

  it.each(EVALUATED_TYPES)('UC-006 · $irq · an evaluator does not get the unpublished $type of a hackathon they do not evaluate', async ({ type, path, otherEvaluator }) => {
    const api = await as(otherEvaluator())
    const unpublishedIds = idsOf(products.announced[type].unpublished)

    const res = await listOf(api, path, announced)

    expect(res.status).toBe(200)
    expect(idsOf(res.body).filter((id) => unpublishedIds.includes(id))).toEqual([])
  })

  it.each(EVALUATED_TYPES)('UC-006 · BRU-018 · the evaluator of the $type hackathon does not get unpublished seeds', async ({ evaluator }) => {
    const api = await as(evaluator())
    const unpublishedIds = idsOf(products.announced.seeds.unpublished)

    const res = await listOf(api, '/seeds', announced)

    expect(res.status).toBe(200)
    expect(idsOf(res.body).filter((id) => unpublishedIds.includes(id))).toEqual([])
  })
})

describe('UC-006 · IRQ-002 · IRQ-003 · IRQ-004 · item shape', () => {
  it.each(forEveryTypeAndActor(PRODUCT_TYPES, EVERY_ACTOR))('UC-006 · $irq · $role gets $type items with no field outside the allowed set', async ({ path, fields, client }) => {
    const api = await client()

    const res = await listOf(api, path, announced)

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    expect(itemsWithFieldsOutsideAllowed(res.body, fields)).toEqual([])
  })

  it.each(forEveryTypeAndActor(PRODUCT_TYPES, EVERY_ACTOR))('UC-006 · $irq · $role gets $type items with every required field', async ({ path, fields, client }) => {
    const api = await client()

    const res = await listOf(api, path, announced)

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    expect(itemsMissingRequiredFields(res.body, fields)).toEqual([])
  })

  it.each(forEveryTypeAndActor(PRODUCT_TYPES, EVERY_ACTOR))('UC-006 · $irq · $role gets $type items whose mainImage is a link', async ({ path, client }) => {
    const api = await client()

    const res = await listOf(api, path, announced)

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    expect(itemsWithMainImageNotALink(res.body)).toEqual([])
  })

  it.each(forEveryTypeAndActor(PRODUCT_TYPES, EVERY_ACTOR))('UC-006 · $irq · $role gets $type items whose authors are a list', async ({ path, client }) => {
    const api = await client()

    const res = await listOf(api, path, announced)

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    expect(itemsWithoutAuthorList(res.body)).toEqual([])
  })

  it.each(forEveryTypeAndActor(PRODUCT_TYPES, EVERY_ACTOR))('UC-006 · $irq · $role gets $type authors with no field outside id, name and surname', async ({ path, client }) => {
    const api = await client()

    const res = await listOf(api, path, announced)

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    expect(authorsOutsideAllowed(res.body)).toEqual([])
  })

  it.each(forEveryTypeAndActor(PRODUCT_TYPES, EVERY_ACTOR))('UC-006 · $irq · $role gets $type authors with id, name and surname', async ({ path, client }) => {
    const api = await client()

    const res = await listOf(api, path, announced)

    expect(res.status).toBe(200)
    expect(res.body.length).toBeGreaterThan(0)
    expect(authorsMissingFields(res.body)).toEqual([])
  })

  it('UC-006 · IRQ-002 · seed authors are its inspiring scientists', async () => {
    const seed = products.announced.seeds.published

    const res = await listOf(asGuest(), '/seeds', announced)

    expect(res.status).toBe(200)
    expect(idsOf(res.body)).toContain(seed.id)
    const listed = res.body.find((item) => item.id === seed.id)
    expect((listed.authors ?? []).map(asAuthor).sort(byId)).toEqual([participant(1)].map(asAuthor).sort(byId))
  })

  it('UC-006 · IRQ-003 · flower authors are its co-creation team members', async () => {
    const flower = products.announced.flowers.published

    const res = await listOf(asGuest(), '/flowers', announced)

    expect(res.status).toBe(200)
    expect(idsOf(res.body)).toContain(flower.id)
    const listed = res.body.find((item) => item.id === flower.id)
    expect((listed.authors ?? []).map(asAuthor).sort(byId)).toEqual([participant(3), participant(4)].map(asAuthor).sort(byId))
  })

  it('UC-006 · IRQ-004 · fruit authors are its own authors', async () => {
    const fruit = products.announced.fruits.published

    const res = await listOf(asGuest(), '/fruits', announced)

    expect(res.status).toBe(200)
    expect(idsOf(res.body)).toContain(fruit.id)
    const listed = res.body.find((item) => item.id === fruit.id)
    expect((listed.authors ?? []).map(asAuthor).sort(byId)).toEqual([participant(8)].map(asAuthor).sort(byId))
  })

  it.each(PRODUCT_TYPES)('UC-006 · $irq · a published item in the $type list has the same fields for guest, participant and staff', async ({ type, path }) => {
    const publishedId = products.announced[type].published.id
    const apis = await Promise.all(EVERY_ACTOR.map(({ client }) => client()))

    const responses = await Promise.all(apis.map((api) => listOf(api, path, announced)))

    expect(responses.map((res) => res.status)).toEqual(EVERY_ACTOR.map(() => 200))
    const fieldsByRole = Object.fromEntries(EVERY_ACTOR.map(({ role }, index) => {
      const listed = responses[index].body.find((item) => item.id === publishedId)
      return [role, listed ? sortedKeysOf(listed) : 'not listed']
    }))
    const guestFields = fieldsByRole.guest
    expect(fieldsByRole).toEqual(Object.fromEntries(EVERY_ACTOR.map(({ role }) => [role, guestFields])))
  })
})
