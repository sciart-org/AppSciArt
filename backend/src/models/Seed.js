import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'

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
    template: {
      type: DataTypes.STRING
    },
    mainImage: {
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
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    },
    indexes: [
      {
        unique: true,
        fields: ['title']
      }
    ]
  }
)

Seed.associate = (db) => {
  const { Edition, SeedEditions, Hackathon, HackathonSeeds, UserProfile, SeedLikes, SeedScientists } = db
  Seed.belongsToMany(Edition, { through: SeedEditions })

  Seed.belongsToMany(Hackathon, { through: HackathonSeeds })

  Seed.belongsToMany(UserProfile, {
    through: SeedLikes,
    as: 'LikedByUsers'
  })

  Seed.belongsToMany(UserProfile, { through: SeedScientists })
}
