import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { UserProfile } from '../UserProfile.js'
import { notNull } from '../modelUtils.js'

export const Designer = sequelize.define(
  'designers',
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

Designer.associate = (db) => {
  const { UserProfile } = db
  Designer.belongsTo(UserProfile)
  UserProfile.hasOne(Designer, notNull('userProfileId'))

  // Designer.belongsTo(Methodology)
  // Methodology.hasMany(Designer)
}
