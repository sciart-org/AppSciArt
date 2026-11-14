import net from 'net'

const DEFAULT_POSTGRES_PORT = 5432

const listenOnFreeLocalPort = (server) => new Promise(resolve => server.listen(0, '127.0.0.1', resolve))

const pipeBothWays = (client, upstream) => {
  client.pipe(upstream)
  upstream.pipe(client)
  for (const [socket, other] of [[client, upstream], [upstream, client]]) {
    socket.on('error', () => other.destroy())
    socket.on('close', () => other.destroy())
  }
}

export const startDatabaseProxy = async (databaseUrl) => {
  const target = new URL(databaseUrl)
  const openSockets = new Set()
  let isCut = false

  const track = (socket) => {
    openSockets.add(socket)
    socket.once('close', () => openSockets.delete(socket))
  }

  const dropOpenConnections = () => {
    for (const socket of openSockets) socket.destroy()
  }

  const server = net.createServer(client => {
    if (isCut) return client.destroy()
    const upstream = net.connect(Number(target.port || DEFAULT_POSTGRES_PORT), target.hostname)
    track(client)
    track(upstream)
    pipeBothWays(client, upstream)
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
    close: () => new Promise(resolve => {
      isCut = true
      dropOpenConnections()
      server.close(() => resolve())
    })
  }
}
