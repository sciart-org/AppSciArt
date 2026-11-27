import { expectedErrorBody, internalErrorBody, isInternalError, logRefusal } from '../middlewares/errorBodies.js'

const NO_ACK = () => {}

const splitAck = (args) => {
  const last = args.at(-1)
  return typeof last === 'function' ? [args.slice(0, -1), last] : [args, NO_ACK]
}

const errorMessageOf = (error) => {
  if (isInternalError(error)) return internalErrorBody(error).error
  logRefusal(error)
  return expectedErrorBody(error).error
}

export const onEvent = (socket, event, handler) => {
  socket.on(event, async (...args) => {
    const [values, ack] = splitAck(args)
    try {
      await handler(...values)
    } catch (error) {
      socket.emit('error_message', errorMessageOf(error))
    } finally {
      ack()
    }
  })
}

export const logSocketErrors = (socket) => {
  socket.on('error', (error) => console.error(`Real-time connection ${socket.id} failed:`, error))
}
