import { sequelize } from '../config/sequelize.js'
import { expectedErrorBody, internalErrorBody, isInternalError, logRefusal } from '../middlewares/errorBodies.js'

const HEADERS_OF_A_DROPPED_RESPONSE = ['Content-Length', 'ETag']
const PIECEWISE_RESPONSE_ERROR = 'Send the whole response with res.send: a response sent in pieces would reach the client before the commit'

export const withController = (f) => withErrorHandler(withTransaction(f))

const closeStartedResponse = (res, error) => {
  console.error('The request failed after its response started:', error)
  if (!res.writableEnded) res.destroy()
}

export const withErrorHandler = (f) => {
  return async (req, res) => {
    try {
      await f(req, res)
    } catch (error) {
      if (res.headersSent) return closeStartedResponse(res, error)
      if (isInternalError(error)) return res.status(500).send(internalErrorBody(error))
      logRefusal(error)
      res.status(error.status).send(expectedErrorBody(error))
    }
  }
}

const runAfterResponse = async (callbacks) => {
  for (const callback of callbacks) {
    try {
      await callback()
    } catch (error) {
      console.error('Work after the response failed:', error)
    }
  }
}

const holdResponseUntilCommit = (res) => {
  const { end, write } = res
  let heldEnd = null

  res.end = (...args) => {
    heldEnd = args
    return res
  }
  res.write = () => {
    throw new Error(PIECEWISE_RESPONSE_ERROR)
  }

  const release = () => {
    res.end = end
    res.write = write
  }

  return {
    deliver: () => {
      release()
      if (heldEnd) end.apply(res, heldEnd)
    },
    drop: () => {
      release()
      heldEnd = null
      for (const header of HEADERS_OF_A_DROPPED_RESPONSE) res.removeHeader(header)
    }
  }
}

export const withTransaction = (f) => {
  return async (req, res) => {
    const afterCommitStack = []
    const addAfterCommit = (fn) => afterCommitStack.push(fn)
    const response = holdResponseUntilCommit(res)

    try {
      await sequelize.transaction(async (t) => {
        req.transaction = t
        await f(req, res, addAfterCommit)
      })
    } catch (error) {
      response.drop()
      throw error
    }

    response.deliver()
    await runAfterResponse(afterCommitStack)
  }
}
