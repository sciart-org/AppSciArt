import { Op } from 'sequelize'
import { Hackathon } from '../models/Hackathon.js'
import { Edition } from '../models/Edition.js'
import { sequelize } from '../config/sequelize.js'
import { errorThrower } from './errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'

const includeEditionName = {
  attributes: {
    include: [
      [sequelize.col('edition.name'), 'editionName']
    ]
  },
  include: [
    {
      model: Edition,
      attributes: []
    }
  ]
}

export async function getIncomingHackathons () {
  return await Hackathon.findAll({
    where: {
      startDate: {
        [Op.gte]: new Date()
      }
    },
    ...includeEditionName
  })
}

export function createHackathon (req, res) {
  res.send({
    message: 'This is the mockup controller for createHackathon'
  })
}

export async function getHackathonDetails (hackathonId) {
  const hackathon = await Hackathon.findByPk(hackathonId, includeEditionName)
  errorThrower(!checkExists(hackathon), 'Hackathon not found.', 404)
  return hackathon
}

export function updateHackathon (req, res) {
  res.send({
    message: 'This is the mockup controller for updateHackathon'
  })
}

export function deleteHackathon (req, res) {
  res.send({
    message: 'This is the mockup controller for deleteHackathon'
  })
}

export function publishHackathon (req, res) {
  res.send({
    message: 'This is the mockup controller for publishHackathon'
  })
}

export function getHackathonUsers (req, res) {
  res.send({
    message: 'This is the mockup controller for getHackathonUsers'
  })
}
