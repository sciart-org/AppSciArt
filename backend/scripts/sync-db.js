import { runSQLFiles } from './read-sql.js'
import { sequelize } from '../src/config/sequelize.js'
import '../src/models/relations.js'

const syncDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connected to database.')

    await sequelize.sync({ alter: true })
    console.log('✅ All models synced.')

    await runSQLFiles('operations', sequelize)

    console.log('🎉 All operations executed.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error executing operations:', err)
    process.exit(1)
  }
}

await syncDatabase()
