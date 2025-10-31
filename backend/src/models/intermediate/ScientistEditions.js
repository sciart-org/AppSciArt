import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { Edition } from '../Edition.js'
import { UserProfile } from '../UserProfile.js'

export const ScientistEditions = sequelize.define(
  'scientist_editions',
  {
    editionId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Edition,
        key: 'id'
      }
    },
    userProfileId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: UserProfile,
        key: 'id'
      }
    }
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['editionId', 'userProfileId']
      }
    ]
  }
)
