import { sequelize } from '../../config/sequelize.js'

export const SeedScientists = sequelize.define(
  'seed_scientists',
  {
  },
  {
    timestamps: false
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['seedId', 'inspiringScientistId']
      }
    ]
  }
)
