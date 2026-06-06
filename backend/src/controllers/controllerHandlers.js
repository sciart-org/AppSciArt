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
    const t = await sequelize.transaction()
    req.transaction = t

    const afterCommitStack = []
    const addAfterCommit = (fn) => afterCommitStack.push(fn)

    try {
      await f(req, res, addAfterCommit)
      await t.commit()
      for (const fn of afterCommitStack) await fn()
    } catch (error) {
      if (!t.finished) await t.rollback()
      throw error
    }
  }
}
