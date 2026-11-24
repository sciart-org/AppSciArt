import request from 'supertest'
import { io as ioClient } from 'socket.io-client'
import { tokenOf } from './tokens.js'
import { assertAppUsesFakes, importFromSrc } from './native.js'

let runningApp

const listenOnFreeLocalPort = (server) => new Promise(resolve => server.listen(0, '127.0.0.1', resolve))

export const startApp = async () => {
  if (runningApp) return runningApp
  const { createApp } = await importFromSrc('app.js')
  const { server, io } = await createApp()
  assertAppUsesFakes()
  await listenOnFreeLocalPort(server)
  runningApp = { server, io, url: `http://127.0.0.1:${server.address().port}` }
  return runningApp
}

export const stopApp = async () => {
  if (!runningApp) return
  const { server, io } = runningApp
  runningApp = undefined
  await new Promise(resolve => io.close(() => resolve()))
  if (server.listening) await new Promise(resolve => server.close(() => resolve()))
}

const appUrl = () => {
  if (!runningApp) throw new Error('The app is not running; tests/support/setup.js starts it.')
  return runningApp.url
}

const httpClient = (baseUrl, authorizationHeader) => {
  const authorized = (pendingRequest) =>
    authorizationHeader ? pendingRequest.set('Authorization', authorizationHeader) : pendingRequest
  const agent = request(baseUrl)
  return {
    get: (path) => authorized(agent.get(path)),
    post: (path) => authorized(agent.post(path)),
    put: (path) => authorized(agent.put(path)),
    patch: (path) => authorized(agent.patch(path)),
    delete: (path) => authorized(agent.delete(path)),
    options: (path) => authorized(agent.options(path))
  }
}

export const clientsFor = (baseUrl) => ({
  asGuest: () => httpClient(baseUrl),
  as: async (user) => httpClient(baseUrl, `Bearer ${await tokenOf(user)}`),
  withToken: (token) => httpClient(baseUrl, `Bearer ${token}`)
})

export const asGuest = () => clientsFor(appUrl()).asGuest()

export const as = async (user) => clientsFor(appUrl()).as(user)

export const withToken = (token) => clientsFor(appUrl()).withToken(token)

const CORS_HEADER_PREFIX = 'access-control-'

const camelCased = (dashedName) => dashedName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

export const corsHeadersOf = (response) => Object.fromEntries(
  Object.entries(response.headers)
    .filter(([name]) => name.toLowerCase().startsWith(CORS_HEADER_PREFIX))
    .map(([name, value]) => [camelCased(name.toLowerCase().slice(CORS_HEADER_PREFIX.length)), value])
)

const openSockets = new Set()

const waitUntilConnected = (socket) => new Promise((resolve, reject) => {
  socket.once('connect', resolve)
  socket.once('connect_error', reject)
})

const JOIN_TIMEOUT_MS = 2000

export const socketAs = async (user, { hackathon, token } = {}) => {
  const jwt = token ?? await tokenOf(user)
  const socket = ioClient(appUrl(), {
    auth: { token: jwt },
    transports: ['polling', 'websocket'],
    reconnection: false,
    forceNew: true
  })
  openSockets.add(socket)
  await waitUntilConnected(socket)
  if (hackathon) await socket.timeout(JOIN_TIMEOUT_MS).emitWithAck('join_hackathon_rooms', hackathon.id)
  return socket
}

export const nextEvent = (socket, event, timeoutMs = 2000) => new Promise((resolve, reject) => {
  const onEvent = (...payload) => {
    clearTimeout(timer)
    resolve(payload.length > 1 ? payload : payload[0])
  }
  const timer = setTimeout(() => {
    socket.off(event, onEvent)
    reject(new Error(`No "${event}" event within ${timeoutMs} ms`))
  }, timeoutMs)
  socket.once(event, onEvent)
})

export const noEventArrives = (socket, event, timeoutMs = 500) =>
  nextEvent(socket, event, timeoutMs).then(() => false, () => true)

export const closeSockets = () => {
  for (const socket of openSockets) socket.disconnect()
  openSockets.clear()
}
