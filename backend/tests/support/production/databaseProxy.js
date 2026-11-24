import net from 'net'

const DEFAULT_POSTGRES_PORT = 5432
const LENGTH_FIELD_SIZE = 4
const TYPE_FIELD_SIZE = 1
const SIMPLE_QUERY_TYPE = 'Q'
const COMMIT_STATEMENT = 'COMMIT;'
const ENCRYPTION_REQUEST_CODES = [80877103, 80877104]

const listenOnFreeLocalPort = (server) => new Promise(resolve => server.listen(0, '127.0.0.1', resolve))

const destroyTogether = (client, upstream) => {
  for (const [socket, other] of [[client, upstream], [upstream, client]]) {
    socket.on('error', () => other.destroy())
    socket.on('close', () => other.destroy())
  }
}

const clientMessageReader = () => {
  let pending = Buffer.alloc(0)
  let awaitingStartup = true

  const nextUntypedMessage = () => {
    if (pending.length < LENGTH_FIELD_SIZE) return null
    const length = pending.readInt32BE(0)
    if (pending.length < length) return null
    const message = pending.subarray(0, length)
    const isEncryptionRequest = length >= 2 * LENGTH_FIELD_SIZE &&
      ENCRYPTION_REQUEST_CODES.includes(message.readInt32BE(LENGTH_FIELD_SIZE))
    awaitingStartup = isEncryptionRequest
    return { bytes: message, type: null, body: message.subarray(LENGTH_FIELD_SIZE) }
  }

  const nextTypedMessage = () => {
    if (pending.length < TYPE_FIELD_SIZE + LENGTH_FIELD_SIZE) return null
    const size = TYPE_FIELD_SIZE + pending.readInt32BE(TYPE_FIELD_SIZE)
    if (pending.length < size) return null
    const message = pending.subarray(0, size)
    return {
      bytes: message,
      type: String.fromCharCode(message[0]),
      body: message.subarray(TYPE_FIELD_SIZE + LENGTH_FIELD_SIZE)
    }
  }

  return (chunk) => {
    pending = Buffer.concat([pending, chunk])
    const messages = []
    let message
    while ((message = awaitingStartup ? nextUntypedMessage() : nextTypedMessage())) {
      messages.push(message)
      pending = pending.subarray(message.bytes.length)
    }
    return messages
  }
}

const isCommit = ({ type, body }) =>
  type === SIMPLE_QUERY_TYPE && body.toString('utf8').replace(/\0$/, '').trim() === COMMIT_STATEMENT

export const startDatabaseProxy = async (databaseUrl) => {
  const target = new URL(databaseUrl)
  const openSockets = new Set()
  let isCut = false
  let reportFailedCommit = null

  const track = (socket) => {
    openSockets.add(socket)
    socket.once('close', () => openSockets.delete(socket))
  }

  const dropOpenConnections = () => {
    for (const socket of openSockets) socket.destroy()
  }

  const forwardUntilFailedCommit = (client, upstream) => {
    const readMessages = clientMessageReader()
    client.on('data', chunk => {
      for (const message of readMessages(chunk)) {
        if (reportFailedCommit && isCommit(message)) {
          client.destroy()
          upstream.destroy()
          reportFailedCommit()
          reportFailedCommit = null
          return
        }
        upstream.write(message.bytes)
      }
    })
    upstream.pipe(client)
  }

  const server = net.createServer(client => {
    if (isCut) return client.destroy()
    const upstream = net.connect(Number(target.port || DEFAULT_POSTGRES_PORT), target.hostname)
    track(client)
    track(upstream)
    forwardUntilFailedCommit(client, upstream)
    destroyTogether(client, upstream)
  })
  await listenOnFreeLocalPort(server)

  const proxyUrl = new URL(databaseUrl)
  proxyUrl.hostname = '127.0.0.1'
  proxyUrl.port = String(server.address().port)

  return {
    url: proxyUrl.toString(),
    cut: () => {
      isCut = true
      dropOpenConnections()
    },
    restore: () => {
      isCut = false
    },
    failNextCommit: () => new Promise(resolve => {
      reportFailedCommit = resolve
    }),
    close: () => new Promise(resolve => {
      isCut = true
      dropOpenConnections()
      server.close(() => resolve())
    })
  }
}
