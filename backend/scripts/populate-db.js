import 'dotenv/config'
import { sequelize } from '../src/config/sequelize.js'
import { deleteDatabase } from './delete-db.js'
import { seedUserProfiles } from './seeders/seedUserProfiles.js'
import { seedEditions } from './seeders/seedEditions.js'
import { seedEarlySignups } from './seeders/seedEarlySignups.js'
import { seedSeeds } from './seeders/seedSeeds.js'
import { seedHackathons } from './seeders/seedHackathons.js'
import { seedFlowers } from './seeders/seedFlowers.js'
import { seedFruits } from './seeders/seedFruits.js'

const populateDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connected to database.')

    await deleteDatabase()
    await seedUserProfiles()
    await seedEditions()
    await seedEarlySignups()
    await seedSeeds()
    await seedHackathons()
    await seedFlowers()
    await seedFruits()

    console.log('🎉 All SQL populators executed.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error populating DB:', err)
    process.exit(1)
  }
}

await populateDatabase()
