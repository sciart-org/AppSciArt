import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js'

export const UserProfile = sequelize.define(
  'user_profiles',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      onDelete: 'CASCADE'
    },
    authId: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: true,
      references: {
        model: {
          tableName: 'users',
          schema: 'auth'
        },
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    surname: {
      type: DataTypes.STRING
    },
    gender: {
      type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER')
    },
    ageRange: {
      type: DataTypes.ENUM('17_OR_LESS', '18-24', '25-34', '35-44', '45-54', '55-64', '65_OR_MORE')
    },
    rangeSetAt: {
      type: DataTypes.DATEONLY
    },
    affiliations: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    areasOfInterest: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    about: {
      type: DataTypes.STRING
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    socialNetworks: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    sites: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    }
  },
  {
    defaultScope: {
      attributes: {
        exclude: ['authId']
      }
    },
    scopes: {
      public: {
        attributes: ['id', 'name', 'surname', 'email']
      }
    },
    schema: 'profiles',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  }
)

UserProfile.prototype.toJSON = function () {
  const values = Model.prototype.toJSON.call(this)

  return {
    ...values,
    editions: values?.editions?.map(e => e.name)
  }
}

UserProfile.associate = (db) => {
  const { Edition, UserProfile, SeedLikes, SeedScientists, ScientistEditions, Seed } = db
  UserProfile.belongsToMany(Seed, {
    through: SeedLikes,
    as: 'LikedSeeds'
  })

  UserProfile.belongsToMany(Seed, { through: SeedScientists })

  UserProfile.belongsToMany(Edition, { through: ScientistEditions })
}
