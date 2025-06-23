import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'

export const Fruit = sequelize.define(
  'fruits',
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
      type: DataTypes.ENUM('IN_BLANK, IN_PROGRESS, IN_REVIEW, PUBLISHED')
    },
    authorVision: {
      type: DataTypes.STRING
    },
    curatorVision: {
      type: DataTypes.STRING
    },
    driveLink: {
      type: DataTypes.STRING
    }
  },
  {
    // Other model options go here
  }
)
