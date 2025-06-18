import { runSQLFiles } from './read-sql.js'
import { sequelize } from '../src/config/sequelize.js'

const run = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connected to database.')

    await sequelize.sync({ alter: true })
    console.log('✅ All models synced.')

    await runSQLFiles('rls', sequelize)

    console.log('🎉 All SQL Row-level-security queries executed.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error enabling RLS:', err)
    process.exit(1)
  }
}

run()
