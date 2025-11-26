import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { UserProfile } from '../UserProfile.js'
import { notNull } from '../modelUtils.js'

export const Facilitator = sequelize.define(
  'facilitators',
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

Facilitator.associate = (db) => {
  const { UserProfile } = db
  Facilitator.belongsTo(UserProfile)
  UserProfile.hasOne(Facilitator, notNull('userProfileId'))

  // Facilitator.belongsTo(Methodology)
  // Methodology.hasMany(Facilitator)
}
