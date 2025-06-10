import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'

export const Edition = sequelize.define(
  'editions',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shortDescription: {
      type: DataTypes.STRING
    },
    longDescription: {
      type: DataTypes.STRING
    },
    catalogLink: {
      type: DataTypes.STRING
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    // Other model options go here
  }
)
