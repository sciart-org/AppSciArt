'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.addColumn(
    { schema: 'profiles', tableName: 'evaluators' },
    'hackathonId',
    {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: { schema: 'public', tableName: 'hackathons' },
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  )

  await queryInterface.addIndex(
    { schema: 'profiles', tableName: 'evaluators' },
    ['userProfileId', 'hackathonId'],
    {
      unique: true,
      name: 'evaluators_userProfileId_hackathonId_unique'
    }
  )
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.removeIndex(
    { schema: 'profiles', tableName: 'evaluators' },
    'evaluators_userProfileId_hackathonId_unique'
  )

  await queryInterface.removeColumn(
    { schema: 'profiles', tableName: 'evaluators' },
    'hackathonId'
  )
}
