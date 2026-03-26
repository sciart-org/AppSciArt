import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize(process.env.DATABASE_URL_PRODUCTION, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log
})

async function keepAliveOnRun () {
  try {
    await sequelize.query('SELECT 1;')
    console.log('🟢 Keepalive dev OK')
  } catch (err) {
    console.error('🔴 Keepalive dev error:', err.message)
  }
}

keepAliveOnRun()
