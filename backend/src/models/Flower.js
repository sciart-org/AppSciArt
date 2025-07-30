import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'
import { Seed } from './Seed.js'

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
    indexes: [
      {
        unique: true,
        fields: ['title']
      }
    ]
  }
)
