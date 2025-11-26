import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'
import { Flower } from './Flower.js'
import { notNull } from './modelUtils.js'

export const Fruit = sequelize.define(
  'fruits',
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
    state: {
      type: DataTypes.ENUM('IN_BLANK', 'IN_PROGRESS', 'IN_REVIEW', 'PUBLISHED'),
      allowNull: false,
      defaultValue: 'IN_BLANK'
    },
    authorVision: {
      type: DataTypes.TEXT
    },
    curatorVision: {
      type: DataTypes.TEXT
    },
    seedDescription: {
      type: DataTypes.TEXT
    },
    driveLink: {
      type: DataTypes.STRING
    },
    flowerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Flower,
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

Fruit.associate = (db) => {
  const { Flower } = db
  Fruit.belongsTo(Flower)
  Flower.hasMany(Fruit, notNull('flowerId'))
}
