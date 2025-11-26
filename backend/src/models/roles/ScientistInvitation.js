import { DataTypes } from 'sequelize'
import { sequelize } from '../../config/sequelize.js'
import { Seed } from '../Seed.js'
import { Edition } from '../Edition.js'
import { notNull } from '../modelUtils.js'

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
    schema: 'public',
    indexes: [
      {
        unique: true,
        fields: ['email', 'seedId', 'editionId'],
        name: 'scientist_invitations_unique_email_seed_edition'
      }
    ]
  }
)

ScientistInvitation.associate = (db) => {
  const { Seed, Edition } = db
  ScientistInvitation.belongsTo(Seed)
  Seed.hasMany(ScientistInvitation)

  ScientistInvitation.belongsTo(Edition)
  Edition.hasMany(ScientistInvitation, notNull('editionId'))
}
