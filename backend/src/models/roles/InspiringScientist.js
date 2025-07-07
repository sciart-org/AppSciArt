import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'

export const InspiringScientist = sequelize.define(
  'inspiring_scientists',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  },
  {
    schema: 'profiles'
  }
)
