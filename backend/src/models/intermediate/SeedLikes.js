import { sequelize } from '../../config/sequelize.js'

export const SeedLikes = sequelize.define(
  'seed_likes',
  {
  },
  {
    timestamps: false
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['seedId', 'userProfileId']
      }
    ]
  }
)
