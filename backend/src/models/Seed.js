import { DataTypes, Model, Op } from 'sequelize'
import { sequelize } from '../config/sequelize.js'
import { UserProfile } from './UserProfile.js'

const publicScope = {
  attributes: {
    exclude: ['createdAt', 'updatedAt', 'state', 'driveLink']
  },
  where: { state: 'PUBLISHED' }
}

export const Seed = sequelize.define(
  'seeds',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.ENUM('IN_BLANK', 'IN_PROGRESS', 'IN_REVIEW', 'PUBLISHED'),
      allowNull: false,
      defaultValue: 'IN_BLANK'
    },
    branchesOfKnowledge: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    seedPDF: {
      type: DataTypes.STRING
    },
    videoLink: {
      type: DataTypes.STRING
    },
    presentationLink: {
      type: DataTypes.STRING
    },
    podcastLink: {
      type: DataTypes.STRING
    },
    driveLink: {
      type: DataTypes.STRING
    }
  }, {
    defaultScope: publicScope,
    scopes: {
      public: publicScope,
      staff: {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      },
      withAuthors: {
        include: [
          {
            model: UserProfile,
            attributes: ['id', 'name', 'surname'],
            through: { attributes: [] }
          }
        ]
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['title']
      }
    ]
  }
)

Seed.prototype.toJSON = function () {
  const values = Model.prototype.toJSON.call(this)
  values.authors = values.user_profiles
  delete values.user_profiles
  return values
}

Seed.associate = (db) => {
  const { Edition, SeedEditions, Hackathon, HackathonSeeds, UserProfile, SeedLikes, SeedScientists } = db
  Seed.belongsToMany(Edition, { through: SeedEditions })

  Seed.belongsToMany(Hackathon, { through: HackathonSeeds })

  Seed.belongsToMany(UserProfile, {
    through: SeedLikes,
    as: 'LikedByUsers'
  })

  Seed.belongsToMany(UserProfile, { through: SeedScientists })

  Seed.addScope('withEdition', (editionId) => ({
    include: [
      {
        model: Edition.unscoped(),
        where: editionId ? { id: editionId } : null,
        attributes: [],
        through: { attributes: [] }
      }
    ]
  }))

  Seed.addScope('withHackathon', (hackathonId) => ({
    include: [
      {
        model: Hackathon,
        where: hackathonId ? { id: hackathonId } : null,
        attributes: [],
        required: true,
        through: { attributes: [] }
      }
    ]
  }))

  Seed.addScope('scientist', (scientistId) => ({
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    where: {
      [Op.or]: [
        { state: 'PUBLISHED' },
        { '$user_profiles.id$': scientistId }
      ]
    },
    include: [
      {
        model: UserProfile,
        attributes: [],
        required: false,
        through: {
          model: SeedScientists,
          attributes: []
        }
      }
    ]
  }))
}
