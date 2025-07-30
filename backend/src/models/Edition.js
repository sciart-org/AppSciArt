import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'

export const Edition = sequelize.define(
  'editions',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
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
      type: DataTypes.TEXT
    },
    catalogLink: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.ENUM('PLANNED', 'ACTIVE', 'CLOSED', 'PUBLISHED'),
      allowNull: false,
      defaultValue: 'PLANNED'
    }
  },
  {
    // Other model options go here
  }
)
