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
    hasConfirmedAssistance: {
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
    scopes: {
      inHackathon: ({ hackathonId, clusterNumber, groupId, teamId, fruitId } = {}) => ({
        where: {
          ...(hackathonId ? { hackathonId } : {}),
          ...(clusterNumber !== undefined ? { clusterNumber } : {}),
          ...(groupId ? { groupId } : {}),
          ...(fruitId ? { fruitId } : teamId ? { teamId } : {})
        },
        attributes: ['id', 'isGroupVoice', 'isTeamSpeaker', 'groupId', 'teamId', 'fruitId', 'hackathonId'],
        include: [
          {
            model: UserProfile,
            attributes: ['id', 'name', 'surname']
          },
          {
            model: ConceptualMap,
            attributes: ['seedId']
          }
        ]
      }),
      withUser: {
        include: {
          model: UserProfile,
          attributes: ['id', 'name', 'surname']
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['userProfileId', 'hackathonId']
      }
    ]
  })

Participation.prototype.toJSON = function () {
  const values = this.get({ plain: true })

  return {
    ...values,
    userProfile: values.user_profile,
    user_profile: undefined,
    conceptual_map: undefined,
    conceptualMap: { ...values?.conceptual_map, seed: undefined, map: undefined },
    groupId: undefined,
    groupSeed: values?.conceptual_map?.seed,
    flower: undefined,
    teamId: undefined,
    teamFlower: { ...values?.flower, seed: values?.flower?.seed },
    fruit: undefined,
    fruitId: undefined,
    teamFruit: values?.fruit
      ? {
          ...values.fruit,
          flower: undefined,
          seed: undefined
        }
      : undefined
  }
}

Participation.associate = (db) => {
  const { ConceptualMap, Flower, Fruit, UserProfile, Hackathon, Seed } = db
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

  Participation.addScope('full', {
    attributes: {
      exclude: ['interests', 'userProfileId']
    },
    include: [
      {
        model: UserProfile,
        attributes: ['id', 'name', 'surname', 'email']
      },
      {
        model: Fruit
      },
      {
        model: Flower.unscoped(),
        attributes: {
          exclude: ['title', 'mainImage', 'concept', 'conceptualMap', 'state', 'seedId']
        },
        include: {
          model: Seed,
          attributes: {
            exclude: ['template', 'state', 'branchesOfKnowledge']
          },
          include: {
            model: UserProfile,
            attributes: ['name', 'surname'],
            through: { attributes: [] }
          }
        }
      },
      {
        model: ConceptualMap,
        attributes: {
          exclude: ['seedId']
        },
        include: {
          model: Seed,
          attributes: {
            exclude: ['template', 'state', 'branchesOfKnowledge']
          }
        }
      }
    ]
  })
}
