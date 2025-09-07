import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'
import { UserProfile } from './UserProfile.js'
import { Hackathon } from './Hackathon.js'
import { Fruit } from './Fruit.js'
import { Flower } from './Flower.js'
import { Seed } from './Seed.js'

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
    },
    groupId: {
      type: DataTypes.UUID,
      references: {
        model: Seed,
        key: 'id'
      }
    },
    teamId: {
      type: DataTypes.UUID,
      references: {
        model: Flower,
        key: 'id'
      }
    },
    fruitId: {
      type: DataTypes.UUID,
      references: {
        model: Fruit,
        key: 'id'
      }
    },
    userProfileId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserProfile,
        key: 'id'
      }
    },
    hackathonId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Hackathon,
        key: 'id'
      }
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userProfileId', 'hackathonId']
      }
    ]
  })
