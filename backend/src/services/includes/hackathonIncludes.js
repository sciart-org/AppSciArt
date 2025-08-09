import { literal } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { Edition } from '../../models/Edition.js'

export const includeEditionName = () => {
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

export const combineIncludes = (includesList) => {
  const attributesInclude = includesList.flatMap(s => s.attributes.include).filter(s => s !== undefined)
  const include = includesList.flatMap(s => s.include).filter(s => s !== undefined)
  return {
    attributes: {
      include: attributesInclude
    },
    include
  }
}
