import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'
import { Seed } from './Seed.js'
import { notNull } from './modelUtils.js'

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
    template: {
      type: DataTypes.STRING
    },
    mainImage: {
      type: DataTypes.STRING
    },
    concept: {
      type: DataTypes.TEXT
    },
    conceptualMap: {
      type: DataTypes.STRING
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
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
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
  const values = this.get({ plain: true })
  return {
    ...values,
    authors: values?.participations?.map(p => p.user_profile),
    participations: undefined,
    seed: values?.seed
  }
}

Flower.associate = (db) => {
  const { Seed } = db
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
        attributes: ['state']
      }
    ]
  }))
}
