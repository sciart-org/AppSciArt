import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js'
import { Seed } from './Seed.js'
import { notNull } from './modelUtils.js'

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
    mainImage: {
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
      admin: {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
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
  return {
    ...values,
    authors: values?.participations?.map(p => p.userProfile),
    participations: undefined,
    seed: values?.seed
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
          'admin',
          { method: ['withHackathon', hackathonId] }
        ]),
        required: true,
        attributes: ['id', 'state', 'title']
      }
    ]
  }))

  Flower.addScope('withSeedsOfEdition', (editionId) => ({
    attributes: ['id', 'title', 'mainImage', 'state'],
    include: [
      {
        model: Seed.scope([
          'admin',
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
        model: Seed.scope(['withAuthors', 'public']),
        required: true
      }
    ]
  })

  Flower.addScope('withAuthors', {
    include: [
      {
        model: Participation.scope('withUser'),
        attributes: ['id']
      }
    ]
  })
}
