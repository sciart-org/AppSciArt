import { sequelize } from '../config/sequelize.js'
import { expectedErrorBody, internalErrorBody, isInternalError } from '../middlewares/errorBodies.js'

export const withController = (f) => withErrorHandler(withTransaction(f))

export const withErrorHandler = (f) => {
  return async (req, res) => {
    try {
      await f(req, res)
    } catch (error) {
      if (isInternalError(error)) return res.status(500).send(internalErrorBody(error))
      console.log(error)
      res.status(error.status).send(expectedErrorBody(error))
    }
  }
}

export const withTransaction = (f) => {
  return async (req, res) => {
    const afterCommitStack = []
    const addAfterCommit = (fn) => afterCommitStack.push(fn)

    await sequelize.transaction(async (t) => {
      req.transaction = t
      await f(req, res, addAfterCommit)
    })

    for (const fn of afterCommitStack) await fn()
  }
}
