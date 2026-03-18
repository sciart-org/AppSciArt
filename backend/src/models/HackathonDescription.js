import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'
import { Hackathon } from './Hackathon.js'
import { notNull } from './modelUtils.js'

export const HackathonDescription = sequelize.define(
  'hackathon_descriptions',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sectionName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    hackathonId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Hackathon,
        key: 'id'
      }
    }
  },
  {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['position', 'ASC']]
    }
  }
)

HackathonDescription.associate = (db) => {
  const { Hackathon } = db
  HackathonDescription.belongsTo(Hackathon)
  Hackathon.hasMany(HackathonDescription, notNull('hackathonId'))
}
