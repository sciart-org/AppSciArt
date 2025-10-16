import { literal } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { Edition } from '../../models/Edition.js'
import { Participation } from '../../models/Participation.js'

export const includeEditionName = () => {
  return {
    attributes: {
      exclude: ['editionId'],
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

export const includeIsEnrolled = (userId) => {
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

export const combineIncludes = (optionList) => {
  const attributesInclude = optionList.flatMap(s => s.attributes?.include).filter(s => s !== undefined)
  const attributesExclude = optionList.flatMap(s => s.attributes?.exclude).filter(s => s !== undefined)
  const include = optionList.flatMap(s => s.include).filter(s => s !== undefined)
  return {
    attributes: {
      exclude: attributesExclude,
      include: attributesInclude
    },
    include
  }
}

export const includeMyHackathons = (userId) => {
  return {
    include: [
      {
        model: Participation,
        attributes: [],
        required: true,
        where: { userProfileId: userId }
      }
    ]
  }
}
