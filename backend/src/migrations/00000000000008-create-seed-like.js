'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('seed_likes', {
    seedId: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'seeds',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    userProfileId: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: { tableName: 'user_profiles', schema: 'profiles' },
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  })
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.dropTable('seed_likes')
}
