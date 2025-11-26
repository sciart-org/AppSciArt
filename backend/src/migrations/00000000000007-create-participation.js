'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('participations', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
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
        model: 'conceptual_maps'
      },
      onDelete: 'SET NULL'
    },
    teamId: {
      type: DataTypes.UUID,
      references: {
        model: 'flowers',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    fruitId: {
      type: DataTypes.UUID,
      references: {
        model: 'fruits',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    userProfileId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: { tableName: 'user_profiles', schema: 'profiles' },
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    hackathonId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'hackathons',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW')
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW')
    }
  })

  // Add unique composite index
  await queryInterface.addIndex('participations', ['userProfileId', 'hackathonId'], {
    unique: true,
    name: 'participations_userProfile_hackathon_unique'
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('participations')
}
