import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js'

export const Edition = sequelize.define(
  'editions',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      unique: true
    },
    driveLink: {
      type: DataTypes.STRING
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shortDescription: {
      type: DataTypes.STRING
    },
    longDescription: {
      type: DataTypes.TEXT
    },
    catalogLink: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.ENUM('PLANNED', 'ACTIVE', 'CLOSED', 'PUBLISHED'),
      allowNull: false,
      defaultValue: 'PLANNED'
    }
  },
  {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt', 'driveLink'] }
    }
  }
)

Edition.prototype.toJSON = function () {
  const values = Model.prototype.toJSON.call(this)
  return {
    ...values,
    fruits: values?.seeds?.flatMap(
      seed => seed.flowers?.flatMap(
        flower => flower.fruits
      )
    ),
    seeds: undefined
  }
}

Edition.associate = (db) => {
  const { UserProfile, ScientistEditions, Seed, SeedEditions } = db
  Edition.belongsToMany(UserProfile, { through: ScientistEditions })

  Edition.belongsToMany(Seed, { through: SeedEditions })

  //  Edition.belongsTo(Methodology)
  //  Methodology.hasMany(Edition)
}
