import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { REFERENCE_DOCS, REFERENCE_DIR } from '../reference.config.js'

const websiteDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const repoDir = join(websiteDir, '..')
const targetDir = join(websiteDir, REFERENCE_DIR)

rmSync(targetDir, { recursive: true, force: true })

for (const file of REFERENCE_DOCS) {
  const target = join(targetDir, file)
  mkdirSync(dirname(target), { recursive: true })
  cpSync(join(repoDir, file), target)
}
