import 'dotenv/config'
import { sequelize } from '../src/config/sequelize.js'
import { deleteDatabase } from './delete-db.js'
import { seedUserProfiles } from './seeders/seedUserProfiles.js'

const populateDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connected to database.')

    await deleteDatabase()
    await seedUserProfiles()

    console.log('🎉 All SQL populators executed.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error populating DB:', err)
    process.exit(1)
  }
}

await populateDatabase()
