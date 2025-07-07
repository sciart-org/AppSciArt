import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'

export const Flower = sequelize.define(
  'flowers',
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
    conceptualMap: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.ENUM('IN_BLANK', 'IN_PROGRESS', 'IN_REVIEW', 'PUBLISHED')
    },
    driveLink: {
      type: DataTypes.STRING
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['title']
      }
    ]
  }
)
