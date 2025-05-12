import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'

export const Edition = sequelize.define(
  'editions',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: false
    },
    longDescription: {
      type: DataTypes.STRING,
      allowNull: false
    },
    catalogLink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    // Other model options go here
  }
)
