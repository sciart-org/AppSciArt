import { Op, literal } from 'sequelize'
import { Hackathon } from '../models/Hackathon.js'
import { Edition } from '../models/Edition.js'
import { sequelize } from '../config/sequelize.js'
import { errorThrower } from './errorThrower.js'
import { checkExists } from '../validators/generalValidators.js'

const includeEditionName = () => {
  return {
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
}

const includeIsEnrolled = (userId) => {
  return {
    attributes: {
      include: [
        [
          literal(userId
            ? `EXISTS (
    SELECT 1 FROM "participations" AS p
      WHERE p."hackathonId" = "hackathons"."id"
      AND p."userProfileId" = '${userId}'
  )`
            : false),
          'isEnrolled'
        ]
      ]
    }
  }
}

const combineIncludes = (includesList) => {
  const attributesInclude = includesList.flatMap(s => s.attributes.include).filter(s => s !== undefined)
  const include = includesList.flatMap(s => s.include).filter(s => s !== undefined)
  return {
    attributes: {
      include: attributesInclude
    },
    include
  }
}

export async function getIncomingHackathons (userId) {
  return await Hackathon.findAll({
    where: {
      startDate: {
        [Op.gte]: new Date()
      }
    },
    ...combineIncludes([includeEditionName(), includeIsEnrolled(userId)])
  })
}

export function createHackathon (req, res) {
  res.send({
    message: 'This is the mockup controller for createHackathon'
  })
}

export async function getHackathonDetails (hackathonId, userId) {
  const hackathon = await Hackathon.findByPk(
    hackathonId,
    combineIncludes([includeEditionName(), includeIsEnrolled(userId)])
  )
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
