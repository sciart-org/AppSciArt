import { runSQLFiles } from './read-sql.js'
import { sequelize } from '../src/config/sequelize.js'

const run = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connected to database.')

    await runSQLFiles('populators', sequelize)

    console.log('🎉 All SQL populators executed.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error populating DB:', err)
    process.exit(1)
  }
}

run()
