import { spawn } from 'child_process'
import { mkdtemp, rm, symlink } from 'fs/promises'
import net from 'net'
import os from 'os'
import path from 'path'
import { pathToFileURL } from 'url'
import { clientsFor } from '../api.js'
import { startDatabaseProxy } from './databaseProxy.js'

const BACKEND_DIR = path.resolve(import.meta.dirname, '../../..')
const SERVER_ENTRY = path.join(BACKEND_DIR, 'src/server.js')
const BOOT_MODULE = pathToFileURL(path.join(import.meta.dirname, 'boot.js')).href
const WHAT_THE_APP_READS_FROM_ITS_WORKING_DIR = ['.oastoolsrc', 'package.json', 'api', 'src']
const VARIABLES_TAKEN_FROM_THE_TESTING_ENV = [
  'PATH', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'JWT_SECRET', 'JWT_ISSUER',
  'RESEND_KEY', 'DRIVE_FOLDER_ID', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'
]
export const DEFAULT_PRODUCTION_FRONTEND_URL = 'https://sciart.example.org'
const STARTUP_TIMEOUT_MS = 20000
const PORT_POLL_INTERVAL_MS = 100

const runningInstances = new Set()
const runningProcesses = new Set()

process.once('exit', () => {
  for (const child of runningProcesses) child.kill('SIGKILL')
})

const workingDirWithoutEnvFiles = async () => {
  const workDir = await mkdtemp(path.join(os.tmpdir(), 'appsciart-production-'))
  for (const entry of WHAT_THE_APP_READS_FROM_ITS_WORKING_DIR) {
    await symlink(path.join(BACKEND_DIR, entry), path.join(workDir, entry))
  }
  return workDir
}

const freeLocalPort = () => new Promise((resolve, reject) => {
  const probe = net.createServer()
  probe.once('error', reject)
  probe.listen(0, '127.0.0.1', () => {
    const { port } = probe.address()
    probe.close(() => resolve(port))
  })
})

const withoutSsl = (databaseUrl) => {
  const url = new URL(databaseUrl)
  url.searchParams.set('ssl', '')
  return url.toString()
}

const isDefined = (value) => value !== undefined && value !== null

const environmentOf = ({ port, databaseUrl, frontendUrl, driveAccess, env }) => {
  const fromTestingEnv = Object.fromEntries(
    VARIABLES_TAKEN_FROM_THE_TESTING_ENV.filter(name => isDefined(process.env[name])).map(name => [name, process.env[name]]))
  const merged = {
    ...fromTestingEnv,
    NODE_ENV: 'production',
    PORT: String(port),
    DATABASE_URL: withoutSsl(databaseUrl),
    FRONTEND_URL: frontendUrl,
    FAKE_DRIVE_ACCESS: driveAccess,
    ...env
  }
  return Object.fromEntries(Object.entries(merged).filter(([, value]) => isDefined(value)))
}

const acceptsConnections = (port) => new Promise(resolve => {
  const socket = net.connect(port, '127.0.0.1')
  socket.once('connect', () => {
    socket.destroy()
    resolve(true)
  })
  socket.once('error', () => resolve(false))
})

const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const listeningOrExited = async ({ port, exited, hasExited }) => {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS
  while (Date.now() < deadline) {
    if (hasExited()) return { started: false, ...(await exited) }
    if (await acceptsConnections(port)) return { started: true }
    await waitFor(PORT_POLL_INTERVAL_MS)
  }
  return { started: false, timedOut: true }
}

const launch = async ({ frontendUrl = DEFAULT_PRODUCTION_FRONTEND_URL, driveAccess, env = {} } = {}) => {
  const workDir = await workingDirWithoutEnvFiles()
  const database = await startDatabaseProxy(process.env.DATABASE_URL)
  const port = await freeLocalPort()
  const child = spawn(process.execPath, ['--import', BOOT_MODULE, SERVER_ENTRY], {
    cwd: workDir,
    env: environmentOf({ port, databaseUrl: database.url, frontendUrl, driveAccess, env }),
    stdio: ['ignore', 'pipe', 'pipe']
  })
  runningProcesses.add(child)

  let output = ''
  const capture = (chunk) => { output += chunk }
  child.stdout.setEncoding('utf8').on('data', capture)
  child.stderr.setEncoding('utf8').on('data', capture)

  let exitCode
  const exited = new Promise(resolve => child.once('exit', (code, signal) => {
    exitCode = code ?? signal
    runningProcesses.delete(child)
    resolve({ exitCode })
  }))
  const hasExited = () => exitCode !== undefined

  const instance = {
    url: `http://127.0.0.1:${port}`,
    output: () => output,
    cutDatabase: database.cut,
    restoreDatabase: database.restore,
    failNextCommit: database.failNextCommit,
    stop: async () => {
      runningInstances.delete(instance)
      if (!hasExited()) {
        child.kill('SIGTERM')
        await exited
      }
      await database.close()
      await rm(workDir, { recursive: true, force: true })
    }
  }
  runningInstances.add(instance)

  const startup = await listeningOrExited({ port, exited, hasExited })
  return { instance, startup }
}

export const productionApp = async (options) => {
  const { instance, startup } = await launch(options)
  if (!startup.started) {
    await instance.stop()
    const reason = startup.timedOut ? `did not listen within ${STARTUP_TIMEOUT_MS} ms` : `exited with ${startup.exitCode}`
    throw new Error(`The production app ${reason}. Its output:\n${instance.output()}`)
  }
  return { ...instance, ...clientsFor(instance.url) }
}

export const productionStartup = async (options) => {
  const { instance, startup } = await launch(options)
  await instance.stop()
  if (startup.timedOut) throw new Error(`The production app neither listened nor exited within ${STARTUP_TIMEOUT_MS} ms`)
  return startup.started
    ? { started: true, exitCode: undefined, output: instance.output() }
    : { started: false, exitCode: startup.exitCode, output: instance.output() }
}

export const stopProductionApps = async () => {
  for (const instance of [...runningInstances]) await instance.stop()
}
