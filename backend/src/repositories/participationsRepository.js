import { Participation } from '../models/Participation.js'

export const getMinimalParticipationOfUserInHackathon = (userId, inHackathonAttributes) => {
  return Participation.scope({ method: ['inHackathon', inHackathonAttributes] }).findOne({
    attributes: ['id', 'hackathonId', 'groupId'],
    where: { userProfileId: userId },
    include: []
  })
}

export const getMinimalParticipation = (participationId) => {
  return Participation.findByPk(participationId, {
    attributes: ['id', 'hackathonId', 'groupId'],
    include: []
  })
}

export const getParticipationById = (participationId) => {
  return Participation.scope('full').findByPk(participationId)
}

export const getMinimalParticipationsOfHackathon = (inHackathonAttributes) => {
  return Participation.scope({ method: ['inHackathon', inHackathonAttributes] }).findAll({
    attributes: ['id', 'groupId', 'teamId'],
    include: []
  })
}

export const getParticipationsOfHackathon = (inHackathonAttributes) => {
  return Participation.scope({ method: ['inHackathon', inHackathonAttributes] }).findAll()
}

export const updateParticipationById = (participationId, body) => {
  return Participation.update(body, { where: { id: participationId } })
}

export const createParticipation = (body) => {
  return Participation.create(body)
}

export const getMinimalParticipationInHackathon = (inHackathonAttributes) => {
  return Participation.scope({ method: ['inHackathon', inHackathonAttributes] }).findOne({
    attributes: ['id', 'hackathonId'],
    include: []
  })
}
