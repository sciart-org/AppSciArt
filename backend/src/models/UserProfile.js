import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'

export const UserProfile = sequelize.define(
  'user_profile',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
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
      type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say')
    },
    birthDate: {
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
    tableName: 'user_profile',
    schema: 'public',
    timestamps: false
  }
)
