import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { UserProfile } from '../UserProfile.js'
import { notNull } from '../modelUtils.js'

export const Administrator = sequelize.define(
  'administrators',
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

Administrator.associate = (db) => {
  const { UserProfile } = db
  Administrator.belongsTo(UserProfile)
  UserProfile.hasOne(Administrator, notNull('userProfileId'))
}
