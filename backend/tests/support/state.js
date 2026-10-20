import { resetDatabase } from './db.js'
import { loadBaseUsers } from './users.js'
import { resetDrive } from './fakes/driveStore.js'
import { clearOutbox } from './fakes/outbox.js'

export const startFromCleanState = async () => {
  await resetDatabase()
  await loadBaseUsers()
  resetDrive()
  clearOutbox()
}
