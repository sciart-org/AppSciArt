import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import '../src/models/relations.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const runSQLFiles = async (dirPath, sequelize) => {
  const fullDirPath = path.join(__dirname, dirPath)
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
