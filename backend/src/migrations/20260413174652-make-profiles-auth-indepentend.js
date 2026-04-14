'use strict'
import { v4 as uuidv4 } from 'uuid'

/** @type {import('sequelize-cli').Migration} */
export async function up (queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()

  try {
    const [fkConstraints] = await queryInterface.sequelize.query(
      `
      SELECT
        conrelid::regclass AS table_name,
        conname AS constraint_name,
        a.attname AS column_name
      FROM pg_constraint c
      JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
      WHERE c.confrelid = 'profiles.user_profiles'::regclass
        AND c.contype = 'f'
      `,
      { transaction }
    )

    for (const fk of fkConstraints) {
      await queryInterface.sequelize.query(
        `ALTER TABLE ${fk.table_name} DROP CONSTRAINT "${fk.constraint_name}"`,
        { transaction }
      )
    }

    await queryInterface.addColumn(
      { tableName: 'user_profiles', schema: 'profiles' },
      'authId',
      { type: Sequelize.UUID, allowNull: true },
      { transaction }
    )

    await queryInterface.sequelize.query(
      'UPDATE profiles.user_profiles SET "authId" = id',
      { transaction }
    )

    await queryInterface.removeConstraint(
      { tableName: 'user_profiles', schema: 'profiles' },
      'user_profiles_id_fkey',
      { transaction }
    )

    const [profiles] = await queryInterface.sequelize.query(
      'SELECT id FROM profiles.user_profiles',
      { transaction }
    )

    for (const profile of profiles) {
      const newId = uuidv4()

      await queryInterface.sequelize.query(
        'UPDATE profiles.user_profiles SET id = :newId WHERE id = :oldId',
        { replacements: { newId, oldId: profile.id }, transaction }
      )

      for (const fk of fkConstraints) {
        await queryInterface.sequelize.query(
          `UPDATE ${fk.table_name} SET "${fk.column_name}" = :newId WHERE "${fk.column_name}" = :oldId`,
          { replacements: { newId, oldId: profile.id }, transaction }
        )
      }
    }

    for (const fk of fkConstraints) {
      await queryInterface.sequelize.query(
        `
        ALTER TABLE ${fk.table_name}
          ADD CONSTRAINT "${fk.constraint_name}"
          FOREIGN KEY ("${fk.column_name}")
          REFERENCES profiles.user_profiles(id)
          ON DELETE CASCADE
        `,
        { transaction }
      )
    }

    await queryInterface.addConstraint(
      { tableName: 'user_profiles', schema: 'profiles' },
      {
        fields: ['authId'],
        type: 'foreign key',
        name: 'user_profiles_authId_fkey',
        references: {
          table: { tableName: 'users', schema: 'auth' },
          field: 'id'
        },
        onDelete: 'CASCADE',
        transaction
      }
    )

    await queryInterface.addIndex(
      { tableName: 'user_profiles', schema: 'profiles' },
      {
        fields: ['authId'],
        unique: true,
        name: 'user_profiles_authId_unique',
        transaction
      }
    )

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

export async function down (queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()

  try {
    const [fkConstraints] = await queryInterface.sequelize.query(
      `
      SELECT
        conrelid::regclass AS table_name,
        conname AS constraint_name,
        a.attname AS column_name
      FROM pg_constraint c
      JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
      WHERE c.confrelid = 'profiles.user_profiles'::regclass
        AND c.contype = 'f'
      `,
      { transaction }
    )

    for (const fk of fkConstraints) {
      await queryInterface.sequelize.query(
        `ALTER TABLE ${fk.table_name} DROP CONSTRAINT "${fk.constraint_name}"`,
        { transaction }
      )
    }

    await queryInterface.removeIndex(
      { tableName: 'user_profiles', schema: 'profiles' },
      'user_profiles_authId_unique',
      { transaction }
    )

    await queryInterface.removeConstraint(
      { tableName: 'user_profiles', schema: 'profiles' },
      'user_profiles_authId_fkey',
      { transaction }
    )

    const [profiles] = await queryInterface.sequelize.query(
      'SELECT id, "authId" FROM profiles.user_profiles',
      { transaction }
    )

    for (const profile of profiles) {
      for (const fk of fkConstraints) {
        await queryInterface.sequelize.query(
          `UPDATE ${fk.table_name} SET "${fk.column_name}" = :oldId WHERE "${fk.column_name}" = :currentId`,
          { replacements: { oldId: profile.authId, currentId: profile.id }, transaction }
        )
      }

      await queryInterface.sequelize.query(
        'UPDATE profiles.user_profiles SET id = :oldId WHERE id = :currentId',
        { replacements: { oldId: profile.authId, currentId: profile.id }, transaction }
      )
    }

    await queryInterface.addConstraint(
      { tableName: 'user_profiles', schema: 'profiles' },
      {
        fields: ['id'],
        type: 'foreign key',
        name: 'user_profiles_id_fkey',
        references: {
          table: { tableName: 'users', schema: 'auth' },
          field: 'id'
        },
        onDelete: 'CASCADE',
        transaction
      }
    )

    for (const fk of fkConstraints) {
      await queryInterface.sequelize.query(
        `
        ALTER TABLE ${fk.table_name}
          ADD CONSTRAINT "${fk.constraint_name}"
          FOREIGN KEY ("${fk.column_name}")
          REFERENCES profiles.user_profiles(id)
          ON DELETE CASCADE
        `,
        { transaction }
      )
    }

    await queryInterface.removeColumn(
      { tableName: 'user_profiles', schema: 'profiles' },
      'authId',
      { transaction }
    )

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}
