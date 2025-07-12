import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { Hackathon } from '../Hackathon.js'
import { Seed } from '../Seed.js'

export const HackathonSeeds = sequelize.define(
  'hackathon_seeds',
  {
    hackathonId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Hackathon,
        key: 'id'
      }
    },
    seedId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Seed,
        key: 'id'
      }
    }
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
