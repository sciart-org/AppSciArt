import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { Seed } from '../Seed.js'
import { Edition } from '../Edition.js'

export const ScientistInvitation = sequelize.define(
  'scientist_invitations',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    seedId: {
      type: DataTypes.UUID,
      references: {
        model: Seed,
        key: 'id'
      }
    },
    editionId: {
      type: DataTypes.UUID,
      references: {
        model: Edition,
        key: 'id'
      }
    }
  },
  {
    schema: 'public'
  }
)
