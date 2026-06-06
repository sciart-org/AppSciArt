import { sequelize } from '../config/sequelize.js'

export const withController = (f) => withErrorHandler(withTransaction(f))

export const withErrorHandler = (f) => {
  return async (req, res) => {
    try {
      await f(req, res)
    } catch (error) {
      console.log(error)
      const status = error.status || 500
      res.status(status).send({ error: error.message || 'Internal Server Error' })
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
