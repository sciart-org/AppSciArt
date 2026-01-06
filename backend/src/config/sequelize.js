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
