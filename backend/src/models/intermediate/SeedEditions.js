import { sequelize } from '../../config/sequelize.js'

export const SeedEditions = sequelize.define(
  'seed_editions',
  {
  },
  {
    timestamps: false
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['seedId', 'editionId']
      }
    ]
  }
)
