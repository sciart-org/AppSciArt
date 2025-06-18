import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'

export const EarlySignup = sequelize.define(
  'early_signups',
  {
    email: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false
  }
)
