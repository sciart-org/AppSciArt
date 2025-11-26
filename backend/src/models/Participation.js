import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sequelize.js'
import { UserProfile } from './UserProfile.js'
import { Hackathon } from './Hackathon.js'
import { Fruit } from './Fruit.js'
import { Flower } from './Flower.js'
import { ConceptualMap } from './ConceptualMap.js'
import { notNull } from './modelUtils.js'

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
    isGroupVoice: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isTeamSpeaker: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    groupId: {
      type: DataTypes.UUID,
      references: {
        model: ConceptualMap,
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
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    },
    indexes: [
      {
        unique: true,
        fields: ['userProfileId', 'hackathonId']
      }
    ]
  })

Participation.associate = (db) => {
  const { ConceptualMap, Flower, Fruit, UserProfile, Hackathon } = db
  ConceptualMap.hasMany(Participation, { foreignKey: 'groupId' })
  Flower.hasMany(Participation, { foreignKey: 'teamId' })
  Fruit.hasMany(Participation, { foreignKey: 'fruitId' })
  UserProfile.hasMany(Participation, notNull('userProfileId'))
  Hackathon.hasMany(Participation, notNull('hackathonId'))
  Participation.belongsTo(ConceptualMap, { foreignKey: 'groupId' })
  Participation.belongsTo(Flower, { foreignKey: 'teamId' })
  Participation.belongsTo(Fruit, { foreignKey: 'fruitId' })
  Participation.belongsTo(UserProfile, notNull('userProfileId'))
  Participation.belongsTo(Hackathon, notNull('hackathonId'))
}
