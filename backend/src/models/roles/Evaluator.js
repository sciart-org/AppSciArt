import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'

export const Evaluator = sequelize.define(
  'evaluators',
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
