import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(process.env.DATABASE_URL_PRODUCTION, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  logging: false
})

async function keepAlive () {
  try {
    await sequelize.authenticate()
    await sequelize.query('SELECT 1;')

    console.log('✅ Supabase activo')
  } catch (error) {
    console.error('❌ Error keepalive:', error.message)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

keepAlive()
