import { describe, it, expect } from 'vitest'
import {
  asGuest,
  as,
  administrator,
  designer,
  facilitator,
  participant,
  anAnnouncedHackathon
} from '../support/index.js'

const NEW_LOCATION = 'Sala de Grados, ETSII, Sevilla'

const locationReadBack = async (hackathon) => {
  const api = await as(facilitator(2))
  const res = await api.get(`/hackathons/${hackathon.id}`)
  return { status: res.status, location: res.body?.location }
}

const anEnrolledParticipant = async (user) => {
  const hackathon = await anAnnouncedHackathon({ type: 'ON_SITE', participants: [user] })
  return { user, hackathon }
}

const anEvaluator = async (user) => {
  const hackathon = await anAnnouncedHackathon({ type: 'ON_SITE', evaluators: [user] })
  return { user, hackathon }
}

const ENROLLED_OR_EVALUATOR_REJECTED = [
  ['participant enrolled in it', () => anEnrolledParticipant(participant(2))],
  ['evaluator of it', () => anEvaluator(participant(3))]
]

const ENROLLED_OR_EVALUATOR_UNCHANGED = [
  ['participant enrolled in it', () => anEnrolledParticipant(participant(4))],
  ['evaluator of it', () => anEvaluator(participant(5))]
]

const OTHER_STAFF = [
  ['designer', () => designer(1)],
  ['administrator', () => administrator(1)]
]

describe('UC-038 · who is rejected when modifying an announced hackathon', () => {
  it('UC-038 · participant modifying the location gets 403', async () => {
    const hackathon = await anAnnouncedHackathon({ type: 'ON_SITE' })
    const api = await as(participant(1))

    const res = await api.put(`/hackathons/${hackathon.id}`).send({ location: NEW_LOCATION })

    expect(res.status).toBe(403)
  })

  it('UC-038 · participant modifying the location leaves it unchanged', async () => {
    const hackathon = await anAnnouncedHackathon({ type: 'ON_SITE' })
    const api = await as(participant(1))

    await api.put(`/hackathons/${hackathon.id}`).send({ location: NEW_LOCATION })

    expect(await locationReadBack(hackathon)).toEqual({ status: 200, location: hackathon.location })
  })

  it.each(ENROLLED_OR_EVALUATOR_REJECTED)('UC-038 · %s modifying the location gets 403', async (_who, arrange) => {
    const { user, hackathon } = await arrange()
    const api = await as(user)

    const res = await api.put(`/hackathons/${hackathon.id}`).send({ location: NEW_LOCATION })

    expect(res.status).toBe(403)
  })

  it.each(ENROLLED_OR_EVALUATOR_UNCHANGED)('UC-038 · %s modifying the location leaves it unchanged', async (_who, arrange) => {
    const { user, hackathon } = await arrange()
    const api = await as(user)

    await api.put(`/hackathons/${hackathon.id}`).send({ location: NEW_LOCATION })

    expect(await locationReadBack(hackathon)).toEqual({ status: 200, location: hackathon.location })
  })

  it('UC-038 · guest modifying the location gets 401', async () => {
    const hackathon = await anAnnouncedHackathon({ type: 'ON_SITE' })

    const res = await asGuest().put(`/hackathons/${hackathon.id}`).send({ location: NEW_LOCATION })

    expect(res.status).toBe(401)
  })

  it('UC-038 · guest modifying the location leaves it unchanged', async () => {
    const hackathon = await anAnnouncedHackathon({ type: 'ON_SITE' })

    await asGuest().put(`/hackathons/${hackathon.id}`).send({ location: NEW_LOCATION })

    expect(await locationReadBack(hackathon)).toEqual({ status: 200, location: hackathon.location })
  })
})

describe('UC-038 · who may modify an announced hackathon', () => {
  it('UC-038 · facilitator modifying the location gets 2xx', async () => {
    const hackathon = await anAnnouncedHackathon({ type: 'ON_SITE' })
    const api = await as(facilitator(1))

    const res = await api.put(`/hackathons/${hackathon.id}`).send({ location: NEW_LOCATION })

    expect(res.status).toBeGreaterThanOrEqual(200)
    expect(res.status).toBeLessThan(300)
  })

  it('UC-038 · facilitator modifying the location shows the new location when read back', async () => {
    const hackathon = await anAnnouncedHackathon({ type: 'ON_SITE' })
    const api = await as(facilitator(1))

    await api.put(`/hackathons/${hackathon.id}`).send({ location: NEW_LOCATION })

    expect(await locationReadBack(hackathon)).toEqual({ status: 200, location: NEW_LOCATION })
  })

  it.each(OTHER_STAFF)('UC-038 · %s modifying the location gets 2xx', async (_role, staffMember) => {
    const hackathon = await anAnnouncedHackathon({ type: 'ON_SITE' })
    const api = await as(staffMember())

    const res = await api.put(`/hackathons/${hackathon.id}`).send({ location: NEW_LOCATION })

    expect(res.status).toBeGreaterThanOrEqual(200)
    expect(res.status).toBeLessThan(300)
  })

  it.each(OTHER_STAFF)('UC-038 · %s modifying the location shows the new location when read back', async (_role, staffMember) => {
    const hackathon = await anAnnouncedHackathon({ type: 'ON_SITE' })
    const api = await as(staffMember())

    await api.put(`/hackathons/${hackathon.id}`).send({ location: NEW_LOCATION })

    expect(await locationReadBack(hackathon)).toEqual({ status: 200, location: NEW_LOCATION })
  })
})
