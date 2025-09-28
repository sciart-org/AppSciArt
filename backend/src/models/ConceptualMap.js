import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'
import { Seed } from './Seed.js'

export const ConceptualMap = sequelize.define(
  'conceptual_maps',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    map: {
      type: DataTypes.JSON
    },
    isDelivered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    seedId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Seed,
        key: 'id'
      }
    }
  },
  {
    // Other model options go here
  }
)
