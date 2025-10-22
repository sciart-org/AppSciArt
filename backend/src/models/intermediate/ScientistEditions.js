import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { InspiringScientist } from '../roles/InspiringScientist.js'
import { Edition } from '../Edition.js'

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
        fields: ['editionId', 'inspiringScientistId']
      }
    ]
  }
)
