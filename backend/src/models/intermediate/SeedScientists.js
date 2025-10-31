import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { Seed } from '../Seed.js'
import { UserProfile } from '../UserProfile.js'

export const SeedScientists = sequelize.define(
  'seed_scientists',
  {
    seedId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Seed,
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
        fields: ['seedId', 'userProfileId']
      }
    ]
  }
)
