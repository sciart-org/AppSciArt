import { stateSharedWithApp } from './native.js'
import { settle } from './appWork.js'

const KIND_BY_PROCESS_EVENT = {
  unhandledRejection: 'unhandled rejection',
  uncaughtException: 'uncaught exception'
}

const recorder = () => stateSharedWithApp('serverCrashes', () => ({ listening: false, crashes: [], noticed: true }))

const describeError = (error) => error instanceof Error ? `${error.name}: ${error.message}` : String(error)

export const recordServerCrashes = () => {
  const state = recorder()
  if (state.listening) return
  for (const [event, kind] of Object.entries(KIND_BY_PROCESS_EVENT)) {
    process.on(event, (error) => {
      state.crashes.push({ kind, message: describeError(error) })
      state.noticed = false
    })
  }
  state.listening = true
}

export const serverCrashes = async () => {
  await settle()
  const state = recorder()
  state.noticed = true
  return state.crashes.map(crash => ({ ...crash }))
}

export const failIfServerCrashedUnnoticed = () => {
  const { crashes, noticed } = recorder()
  if (noticed || crashes.length === 0) return
  const list = crashes.map(({ kind, message }) => `  - ${kind}: ${message}`).join('\n')
  throw new Error(`The server crashed during this test (src/server.js would have exited):\n${list}`)
}

export const forgetServerCrashes = () => {
  const state = recorder()
  state.crashes.length = 0
  state.noticed = true
}
