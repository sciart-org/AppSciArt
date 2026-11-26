import { Sequelize, QueryTypes } from 'sequelize'

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  logging: false
})

async function countAppliedMigrations () {
  const [{ count }] = await sequelize.query(
    'SELECT count(*)::int AS count FROM "SequelizeMeta";',
    { type: QueryTypes.SELECT }
  )
  return count
}

async function keepAlive () {
  try {
    const appliedMigrations = await countAppliedMigrations()
    if (appliedMigrations === 0) throw new Error('no applied migrations found')

    console.log(`✅ Supabase activo (${appliedMigrations} migraciones)`)
  } catch (error) {
    console.error('❌ Error keepalive:', error.message)
    process.exitCode = 1
  } finally {
    await sequelize.close()
  }
}

keepAlive()
