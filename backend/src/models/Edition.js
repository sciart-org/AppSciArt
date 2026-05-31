import { DataTypes, Model, Op } from 'sequelize'
import { sequelize } from '../config/sequelize.js'

const publicScope = {
  attributes: { exclude: ['createdAt', 'updatedAt', 'driveLink', 'longDescription', 'catalogLink'] },
  where: {
    state: { [Op.ne]: 'PLANNED' }
  },
  order: [['year', 'DESC']]
}

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
    defaultScope: publicScope,
    scopes: {
      public: publicScope,
      staff: {
        attributes: { exclude: ['createdAt', 'updatedAt', 'longDescription', 'catalogLink'] },
        order: [['year', 'DESC']]
      },
      detail: {
        attributes: { include: ['longDescription', 'catalogLink'] }
      },
      inState: (state) => ({
        where: {
          state: { [Op.in]: state }
        }
      })
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
  const { UserProfile, ScientistEditions, Seed, SeedEditions, Flower, Fruit } = db
  Edition.belongsToMany(UserProfile, { through: ScientistEditions })

  Edition.belongsToMany(Seed, { through: SeedEditions })

  Edition.addScope('withFruits', {
    include: [{
      model: Seed,
      attributes: ['id'],
      required: false,
      through: { attributes: [] },
      include: [
        {
          model: Flower,
          attributes: ['id'],
          required: false,
          include: [
            {
              model: Fruit,
              attributes: ['id', 'title'],
              required: false
            }
          ]
        }
      ]
    }]
  })

  //  Edition.belongsTo(Methodology)
  //  Methodology.hasMany(Edition)
}
