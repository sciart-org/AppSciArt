import { afterAll, afterEach, beforeAll } from 'vitest'
import { loadLocalTestingEnvironment } from './env.js'
import { closeDb } from './db.js'
import { startApp, stopApp, closeSockets } from './api.js'
import { importFromSrc, redirectThirdPartyServicesToFakes } from './native.js'
import { startFromCleanState } from './state.js'

redirectThirdPartyServicesToFakes()
loadLocalTestingEnvironment()

beforeAll(async () => {
  await startFromCleanState()
  await startApp()
})

afterEach(() => closeSockets())

afterAll(async () => {
  await stopApp()
  const { sequelize } = await importFromSrc('config/sequelize.js')
  await sequelize.close()
  await closeDb()
})
