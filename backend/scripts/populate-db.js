import 'dotenv/config'
import { sequelize } from '../src/config/sequelize.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const runSQLFiles = async (dirPath) => {
  const fullDirPath = path.join(__dirname, 'populators')
  let files = fs.readdirSync(fullDirPath).filter(file => file.endsWith('.sql'))
  files = files.sort()

  for (const file of files) {
    const filePath = path.join(fullDirPath, file)
    const sql = fs.readFileSync(filePath, 'utf-8')

    try {
      await sequelize.query(sql)
      console.log(`✅ Executed ${file}`)
    } catch (err) {
      console.error(`❌ Failed executing ${file}:`, err)
    }
  }
}

const run = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connected to database.')

    await runSQLFiles('./populators')

    console.log('🎉 All SQL populators executed.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error populating DB:', err)
    process.exit(1)
  }
}

run()
