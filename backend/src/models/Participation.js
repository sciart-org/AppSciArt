import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'

export const Participation = sequelize.define(
  'participations', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    clusterNumber: {
      type: DataTypes.INTEGER
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    },
    interests: {
      type: DataTypes.TEXT
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userProfileId', 'hackathonId']
      }
    ]
  })
