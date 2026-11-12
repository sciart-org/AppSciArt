import { describe, it, expect } from 'vitest'
import {
  asGuest,
  as,
  facilitator,
  participant,
  anAnnouncedHackathon
} from '../support/index.js'

const JOINING_INFO = { roles: ['ARTIST', 'TECHNOLOGIST'], interests: 'I want to explore art and science together' }

const enrolmentMarkOf = async (user, hackathon) => {
  const api = await as(user)
  const res = await api.get('/hackathons')
  const item = Array.isArray(res.body) ? res.body.find((listed) => listed.id === hackathon.id) : undefined
  return { status: res.status, listed: item !== undefined, isEnrolled: item?.isEnrolled }
}

describe('UC-005 · enrolling yourself in an announced hackathon', () => {
  it('UC-005 · UC-041 · participant joining through participants/me is enrolled', async () => {
    const hackathon = await anAnnouncedHackathon()
    const joiner = participant(1)
    const api = await as(joiner)

    const res = await api.post(`/hackathons/${hackathon.id}/participants/me`).send(JOINING_INFO)

    expect({ status: res.status }).toEqual({ status: 201 })
    expect(await enrolmentMarkOf(joiner, hackathon)).toEqual({ status: 200, listed: true, isEnrolled: true })
  })

  it('UC-005 · UC-041 · participant enrolling themselves through their own user id is enrolled', async () => {
    const hackathon = await anAnnouncedHackathon()
    const joiner = participant(2)
    const api = await as(joiner)

    const res = await api.post(`/hackathons/${hackathon.id}/participants/${joiner.id}`).send(JOINING_INFO)

    expect({ status: res.status }).toEqual({ status: 201 })
    expect(await enrolmentMarkOf(joiner, hackathon)).toEqual({ status: 200, listed: true, isEnrolled: true })
  })
})

describe('UC-005 · enrolling someone else in an announced hackathon', () => {
  it('UC-005 · participant enrolling another participant gets 403', async () => {
    const hackathon = await anAnnouncedHackathon()
    const other = participant(4)
    const api = await as(participant(3))

    const res = await api.post(`/hackathons/${hackathon.id}/participants/${other.id}`).send(JOINING_INFO)

    expect({ status: res.status }).toEqual({ status: 403 })
  })

  it('UC-005 · participant enrolling another participant leaves them not enrolled', async () => {
    const hackathon = await anAnnouncedHackathon()
    const other = participant(8)
    const api = await as(participant(7))

    await api.post(`/hackathons/${hackathon.id}/participants/${other.id}`).send(JOINING_INFO)

    expect(await enrolmentMarkOf(other, hackathon)).toEqual({ status: 200, listed: true, isEnrolled: false })
  })

  it('UC-005 · guest enrolling a participant gets 401', async () => {
    const hackathon = await anAnnouncedHackathon()
    const target = participant(5)

    const res = await asGuest().post(`/hackathons/${hackathon.id}/participants/${target.id}`).send(JOINING_INFO)

    expect({ status: res.status }).toEqual({ status: 401 })
  })

  it('UC-005 · guest enrolling a participant leaves them not enrolled', async () => {
    const hackathon = await anAnnouncedHackathon()
    const target = participant(9)

    await asGuest().post(`/hackathons/${hackathon.id}/participants/${target.id}`).send(JOINING_INFO)

    expect(await enrolmentMarkOf(target, hackathon)).toEqual({ status: 200, listed: true, isEnrolled: false })
  })

  it('UC-005 · UC-041 · facilitator enrolling a participant enrols them', async () => {
    const hackathon = await anAnnouncedHackathon()
    const target = participant(6)
    const api = await as(facilitator(1))

    const res = await api.post(`/hackathons/${hackathon.id}/participants/${target.id}`).send(JOINING_INFO)

    expect({ status: res.status }).toEqual({ status: 201 })
    expect(await enrolmentMarkOf(target, hackathon)).toEqual({ status: 200, listed: true, isEnrolled: true })
  })
})
