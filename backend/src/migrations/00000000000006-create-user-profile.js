'use strict'

/** @type {import('sequelize-cli').Migration} */

export async function up (queryInterface, Sequelize) {
  await queryInterface.createSchema('profiles')

  await queryInterface.createTable(
    { tableName: 'user_profiles', schema: 'profiles' },
    {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: { tableName: 'users', schema: 'auth' },
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING
      },
      surname: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER')
      },
      ageRange: {
        type: Sequelize.ENUM('17_OR_LESS', '18-24', '25-34', '35-44', '45-54', '55-64', '65_OR_MORE')
      },
      rangeSetAt: {
        type: Sequelize.DATEONLY
      },
      affiliations: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      areasOfInterest: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      about: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      socialNetworks: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      sites: {
        type: Sequelize.ARRAY(Sequelize.STRING)
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
