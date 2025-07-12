import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { Seed } from '../Seed.js'
import { Edition } from '../Edition.js'

export const SeedEditions = sequelize.define(
  'seed_editions',
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
    editionId: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Edition,
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
        fields: ['seedId', 'editionId']
      }
    ]
  }
)
