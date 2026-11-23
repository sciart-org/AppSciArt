import { afterAll, afterEach, beforeAll } from 'vitest'
import { loadLocalTestingEnvironment } from './env.js'
import { closeDb } from './db.js'
import { startApp, stopApp, closeSockets } from './api.js'
import { importFromSrc, redirectThirdPartyServicesToFakes } from './native.js'
import { startFromCleanState } from './state.js'
import { stopProductionApps } from './production/productionApp.js'
import { settle, trackAppQueries } from './appWork.js'
import { failIfServerCrashedUnnoticed, forgetServerCrashes, recordServerCrashes } from './crashes.js'
import { restoreEmailDelivery } from './fakes/emailDelivery.js'

redirectThirdPartyServicesToFakes()
recordServerCrashes()
loadLocalTestingEnvironment()

const settleAndCheckForCrashes = async () => {
  await settle()
  failIfServerCrashedUnnoticed()
}

beforeAll(async () => {
  await startFromCleanState()
  await trackAppQueries()
  await startApp()
})

afterEach(async () => {
  closeSockets()
  try {
    await settleAndCheckForCrashes()
  } finally {
    forgetServerCrashes()
    restoreEmailDelivery()
  }
})

afterAll(async () => {
  try {
    await settleAndCheckForCrashes()
  } finally {
    await stopProductionApps()
    await stopApp()
    const { sequelize } = await importFromSrc('config/sequelize.js')
    await sequelize.close()
    await closeDb()
  }
})
