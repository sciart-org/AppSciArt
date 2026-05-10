import { DataTypes, literal, Op } from 'sequelize'
import { sequelize } from '../config/sequelize.js'
import { Edition } from './Edition.js'
import { notNull } from './modelUtils.js'

const publicScope = {
  attributes: {
    exclude: ['createdAt', 'updatedAt', 'isPrivate', 'internalName', 'driveLink']
  },
  where: { isPrivate: false, state: { [Op.ne]: 'PLANNED' } },
  order: [['startDate', 'ASC']]
}

export const Hackathon = sequelize.define(
  'hackathons',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    internalName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      unique: true
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    driveLink: {
      type: DataTypes.STRING
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    },
    type: {
      type: DataTypes.ENUM('ON_SITE', 'ONLINE', 'HYBRID'),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.ENUM('PLANNED', 'OPEN', 'CLOSED', 'FINISHED'),
      allowNull: false,
      defaultValue: 'PLANNED'
    },
    phase: {
      type: DataTypes.ENUM('PREPARING', 'GROUP_CREATION', 'GROUP_WORK', 'GROUP_PRESENTATION', 'TEAM_CREATION', 'TEAM_WORK', 'TEAM_PRESENTATION'),
      allowNull: false,
      defaultValue: 'PREPARING'
    },
    meetLink: {
      type: DataTypes.STRING
    },
    editionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Edition,
        key: 'id'
      }
    }
  },
  {
    defaultScope: publicScope,
    scopes: {
      public: publicScope,
      admin: {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [['startDate', 'ASC']]
      },
      withEdition: {
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
      },
      withEnrollment: (userId) => ({
        attributes: {
          include: [
            [
              userId
                ? literal(`EXISTS (
                SELECT 1 FROM "participations" AS p
                WHERE p."hackathonId" = "hackathons"."id"
                AND p."userProfileId" = '${userId}'
              )`)
                : literal('false'),
              'isEnrolled'
            ]
          ]
        }
      })
    }
  }
)

Hackathon.associate = (db) => {
  const { Edition, Seed, HackathonSeeds, Participation, UserProfile, ConceptualMap } = db
  Hackathon.belongsTo(Edition)
  Edition.hasMany(Hackathon, notNull('editionId'))

  Hackathon.belongsToMany(Seed, { through: HackathonSeeds })

  Hackathon.addScope('withAllParticipations', () => ({
    include: [
      {
        model: Participation.scope({ method: ['full', false] }),
        include: [
          {
            model: UserProfile,
            attributes: ['id', 'name', 'surname', 'email']
          },
          {
            model: ConceptualMap,
            attributes: ['id', 'seedId']
          }
        ]
      }
    ]
  }))

  Hackathon.addScope('withUserParticipation', (userId) => ({
    include: [
      {
        model: Participation,
        attributes: [],
        required: true,
        where: { userProfileId: userId }
      }
    ]
  }))
}
