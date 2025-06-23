import { Op } from 'sequelize'
import { Hackathon } from '../models/Hackathon.js'
import { Edition } from '../models/Edition.js'
import { sequelize } from '../config/sequelize.js'

export async function getIncomingHackathons () {
  return await Hackathon.findAll({
    where: {
      startDate: {
        [Op.gte]: new Date()
      }
    },
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
  })
}

export function createHackathon (req, res) {
  res.send({
    message: 'This is the mockup controller for createHackathon'
  })
}

export function getHackathonDetails (req, res) {
  res.send({
    message: 'This is the mockup controller for getHackathonDetails'
  })
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
