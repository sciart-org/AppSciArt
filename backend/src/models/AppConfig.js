import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'

export const AppConfig = sequelize.define(
  'app_config',
  {
    key: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    value: DataTypes.TEXT
  },
  {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
  }
)
