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
  const { Seed, Participation } = db
  ConceptualMap.belongsTo(Seed)
  Seed.hasMany(ConceptualMap, notNull('seedId'))

  ConceptualMap.addScope('withSeeds', {
    attributes: ['id', 'seedId'],
    include: [
      {
        model: Seed.scope('public'),
        attributes: ['id', 'mainImage', 'title']
      }
    ]
  })

  ConceptualMap.addScope('withSeedsOfHackathon', (hackathonId) => ({
    attributes: ['id', 'seedId', 'isDelivered'],
    include: [
      {
        model: Seed.scope([
          'public',
          { method: ['withHackathon', hackathonId] }
        ]),
        required: true,
        attributes: ['state', 'title']
      }
    ]
  }))

  ConceptualMap.addScope('withParticipants', {
    include: [{
      model: Participation.scope('inHackathon')
    }],
    order: [['createdAt', 'ASC']]
  })
}
