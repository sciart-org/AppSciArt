import { sequelize } from '../../config/sequelize.js'

export const HackathonSeeds = sequelize.define(
  'hackathon_seeds',
  {
  },
  {
    timestamps: false
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['seedId', 'hackathonId']
      }
    ]
  })
