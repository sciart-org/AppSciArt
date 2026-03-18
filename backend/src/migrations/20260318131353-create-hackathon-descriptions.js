'use strict'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  await queryInterface.createTable('hackathon_descriptions', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    sectionName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    position: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    hackathonId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'hackathons',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    }
  })

  await queryInterface.addIndex(
    { tableName: 'hackathon_descriptions', schema: 'public' },
    ['hackathonId', 'position'],
    {
      unique: true,
      name: 'hackathon_sections_unique_position'
    }
  )
}

export async function down (queryInterface, Sequelize) {
  await queryInterface.removeIndex('hackathon_descriptions', 'hackathon_sections_unique_position')
  await queryInterface.dropTable('hackathon_descriptions')
}
