import dotenvFlow from 'dotenv-flow'
import { Sequelize, Model } from 'sequelize'

dotenvFlow.config()

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log
})

Model.prototype.toJSON = function () {
  const raw = this.get()
  const values = {}

  for (const key of Object.keys(raw)) {
    if (raw[key] instanceof Model) {
      values[key] = raw[key].toJSON()
    } else if (Array.isArray(raw[key])) {
      values[key] = raw[key].map((item) =>
        item instanceof Model ? item.toJSON() : item
      )
    } else {
      values[key] = raw[key]
    }
  }

  return values
}

async function keepAliveOnRun () {
  try {
    await sequelize.query('SELECT 1;')
    console.log('🟢 Keepalive dev OK')
  } catch (err) {
    console.error('🔴 Keepalive dev error:', err.message)
  }
}

keepAliveOnRun()
