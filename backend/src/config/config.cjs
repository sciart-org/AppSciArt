require('dotenv-flow').config()

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    seederStorage: 'sequelize'
  },
  'pre-production': {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
  },
  testing: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {}
  }
}
