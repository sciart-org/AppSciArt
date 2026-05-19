import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { UserProfile } from '../UserProfile.js'
import { notNull } from '../modelUtils.js'

export const Evaluator = sequelize.define(
  'evaluators',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userProfileId: {
      type: DataTypes.UUID,
      references: {
        model: UserProfile,
        key: 'id'
      }
    },
    hackathonId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'hackathons',
        key: 'id'
      }
    }
  },
  {
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },
    schema: 'profiles',
    indexes: [
      {
        unique: true,
        fields: ['userProfileId', 'hackathonId']
      }
    ]
  }
)

Evaluator.associate = (db) => {
  const { UserProfile, Hackathon } = db
  Evaluator.belongsTo(UserProfile)
  UserProfile.hasOne(Evaluator, notNull('userProfileId'))

  Evaluator.belongsTo(Hackathon)
  Hackathon.hasMany(Evaluator, notNull('hackathonId'))

  // Evaluator.belongsTo(Methodology)
  // Methodology.hasMany(Evaluator)
}
