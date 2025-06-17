import { Op } from 'sequelize'
import { Hackathon } from '../models/Hackathon.js'
import { Edition } from '../models/Edition.js'
import { sequelize } from '../config/sequelize.js'

export async function getHackathons (req, res) {
  const { filter } = req.query
  if (filter === 'closest') {
    res.status(500).send({
      message: 'Fetch closest hackathon not yet implemented'
    })
  } else if (filter === 'incoming') {
    await getIncomingHackathons(req, res)
  } else {
    res.status(500).send({
      message: 'Hackathon filtering not yet implemented'
    })
  }
}

const getIncomingHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.findAll({
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
    res.status(200).send(hackathons)
  } catch (error) {
    console.error('Error getting hackathons:', error)
    res.status(500).json({ error: 'Server error' })
  }
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
