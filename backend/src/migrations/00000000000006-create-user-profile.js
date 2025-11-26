'use strict'
import { DataTypes } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */

export async function up (queryInterface, Sequelize) {
  await queryInterface.createSchema('profiles')

  await queryInterface.createTable(
    { tableName: 'user_profiles', schema: 'profiles' },
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: { tableName: 'users', schema: 'auth' },
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
    }
  )

  // Add unique index on email
}

export async function down (queryInterface, Sequelize) {
  /*
  // Drop the table
  await queryInterface.dropTable({ tableName: 'user_profiles', schema: 'profiles' })

  // Drop enums
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_profiles_user_profiles_gender";')
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_profiles_user_profiles_ageRange";')
  */
}
