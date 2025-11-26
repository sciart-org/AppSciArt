import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { sequelize } from '../config/sequelize.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const db = {}

function readModelFiles (dir) {
  let files = []
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(readModelFiles(fullPath))
    } else if (file !== 'index.js' && file.endsWith('.js')) {
      files.push(fullPath)
    }
  }
  return files
}

const modelFiles = readModelFiles(__dirname)

for (const file of modelFiles) {
  const module = await import(file)
  const modelName = Object.keys(module)[0]
  const model = module[modelName]
  Object.assign(db, { [modelName]: model })
}

for (const model of Object.values(db)) {
  if (typeof model.associate === 'function') {
    model.associate(db)
  }
}

db.sequelize = sequelize
db.Sequelize = sequelize.Sequelize

export default db
