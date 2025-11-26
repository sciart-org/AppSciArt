import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { UserProfile } from '../UserProfile.js'
import { notNull } from '../modelUtils.js'

export const Evaluator = sequelize.define(
  'evaluators',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userProfileId: {
      type: DataTypes.UUID,
      references: {
        model: UserProfile,
        key: 'id'
      }
    }
  },
  {
    schema: 'profiles'
  }
)

Evaluator.associate = (db) => {
  const { UserProfile } = db
  Evaluator.belongsTo(UserProfile)
  UserProfile.hasOne(Evaluator, notNull('userProfileId'))

  // Evaluator.belongsTo(Methodology)
  // Methodology.hasMany(Evaluator)
}
