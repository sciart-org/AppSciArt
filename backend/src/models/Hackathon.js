import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'
import { Edition } from './Edition.js'
import { notNull } from './modelUtils.js'

export const Hackathon = sequelize.define(
  'hackathons',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    logo: {
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
      type: DataTypes.ENUM('PREPARING', 'GROUP_CREATION', 'GROUP_WORK', 'GROUP_PRESENTATION', 'TEAM_CREATION', 'TEAM_WORK'),
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
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
  }
)

Hackathon.associate = (db) => {
  const { Edition, Seed, HackathonSeeds } = db
  Hackathon.belongsTo(Edition)
  Edition.hasMany(Hackathon, notNull('editionId'))

  Hackathon.belongsToMany(Seed, { through: HackathonSeeds })
}
