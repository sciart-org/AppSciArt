import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'

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
    isVisible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    meetLink: {
      type: DataTypes.STRING
    }
  },
  {
    // Other model options go here
  }
)
