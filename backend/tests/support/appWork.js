import { stateSharedWithApp, importFromSrc } from './native.js'

const QUIET_TURNS_NEEDED = 3
const DEFAULT_SETTLE_TIMEOUT_MS = 5000
const BUSY_POLL_MS = 5

const appWork = () => stateSharedWithApp('appWork', () => ({ inFlight: 0, trackingQueries: false }))

export const countAsAppWork = async (work) => {
  appWork().inFlight++
  try {
    return await work()
  } finally {
    appWork().inFlight--
  }
}

export const trackAppQueries = async () => {
  const work = appWork()
  if (work.trackingQueries) return
  const { sequelize } = await importFromSrc('config/sequelize.js')
  const runQuery = sequelize.query.bind(sequelize)
  sequelize.query = (...args) => countAsAppWork(() => runQuery(...args))
  work.trackingQueries = true
}

const nextTurn = () => new Promise(resolve => setImmediate(resolve))

const shortPause = () => new Promise(resolve => setTimeout(resolve, BUSY_POLL_MS))

const isIdle = () => appWork().inFlight === 0

export const settle = async ({ timeout = DEFAULT_SETTLE_TIMEOUT_MS } = {}) => {
  const deadline = Date.now() + timeout
  let quietTurns = 0
  while (quietTurns < QUIET_TURNS_NEEDED) {
    if (Date.now() > deadline) {
      throw new Error(`settle(): the app was still busy after ${timeout} ms (${appWork().inFlight} database queries or email sends running)`)
    }
    const wasIdle = isIdle()
    await (wasIdle ? nextTurn() : shortPause())
    quietTurns = wasIdle && isIdle() ? quietTurns + 1 : 0
  }
}
