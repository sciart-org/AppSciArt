import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'
import { Seed } from './Seed.js'
import { notNull } from './modelUtils.js'

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
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
  }
)

ConceptualMap.associate = (db) => {
  const { Seed } = db
  ConceptualMap.belongsTo(Seed)
  Seed.hasMany(ConceptualMap, notNull('seedId'))
}
