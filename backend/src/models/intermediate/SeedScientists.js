import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { Seed } from '../Seed.js'
import { InspiringScientist } from '../roles/InspiringScientist.js'

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
    inspiringScientistId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: InspiringScientist,
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
        fields: ['seedId', 'inspiringScientistId']
      }
    ]
  }
)
