import { DataTypes, Model, Op } from 'sequelize'
import { sequelize } from '../config/sequelize.js'
import { Seed } from './Seed.js'
import { notNull } from './modelUtils.js'
import { ROLE_SCOPE_NAMES } from '../services/RoleScopeNames.js'

const publicScope = {
  attributes: {
    exclude: ['createdAt', 'updatedAt', 'state', 'driveLink']
  },
  where: { state: 'PUBLISHED' }
}

export const Flower = sequelize.define(
  'flowers',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    concept: {
      type: DataTypes.TEXT
    },
    state: {
      type: DataTypes.ENUM('IN_BLANK', 'IN_PROGRESS', 'IN_REVIEW', 'PUBLISHED'),
      allowNull: false,
      defaultValue: 'IN_BLANK'
    },
    driveLink: {
      type: DataTypes.STRING
    },
    seedId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Seed,
        key: 'id'
      }
    }
  }, {
    defaultScope: publicScope,
    scopes: {
      public: publicScope,
      staff: {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      },
      participant: {
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'state', 'driveLink']
        },
        where: {
          [Op.or]: [
            { state: 'PUBLISHED' },
            { state: 'IN_REVIEW' }
          ]
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['title']
      }
    ]
  }
)

Flower.prototype.toJSON = function () {
  const values = Model.prototype.toJSON.call(this)
  const flowerState = values.state
  const isDelivered = flowerState === 'IN_REVIEW' || flowerState === 'PUBLISHED'
  return {
    ...values,
    authors: values?.participations?.map(p => p.userProfile),
    participations: undefined,
    seed: values?.seed,
    isDelivered: isDelivered ?? undefined
  }
}

Flower.associate = (db) => {
  const { Seed, Participation } = db
  Flower.belongsTo(Seed)
  Seed.hasMany(Flower, notNull('seedId'))

  Flower.addScope('withSeedsOfHackathon', (hackathonId) => ({
    attributes: ['id', 'seedId'],
    include: [
      {
        model: Seed.scope([
          ROLE_SCOPE_NAMES.PUBLIC,
          { method: ['withHackathon', hackathonId] },
          'withAuthors'
        ]),
        required: true,
        attributes: ['id', 'state', 'title']
      }
    ]
  }))

  Flower.addScope('withSeedsOfEdition', (editionId) => ({
    attributes: ['id', 'title', 'state'],
    include: [
      {
        model: Seed.scope([
          ROLE_SCOPE_NAMES.PUBLIC,
          { method: ['withEdition', editionId] }
        ]),
        required: true,
        attributes: ['id', 'title']
      }
    ]
  }))

  Flower.addScope('withSeeds', {
    include: [
      {
        model: Seed.scope(['withAuthors', ROLE_SCOPE_NAMES.PUBLIC]),
        required: true
      }
    ]
  })

  Flower.addScope('withAuthors', {
    include: [
      {
        model: Participation.scope('withUser'),
        attributes: ['id', 'hackathonId', 'isTeamSpeaker', 'isGroupVoice']
      }
    ]
  })
}
