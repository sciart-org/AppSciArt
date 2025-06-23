export const withErrorHandler = (f) => {
  return async (req, res) => {
    try {
      await f(req, res)
    } catch (error) {
      const status = error.status || 500
      res.status(status).send({ error: error.message || 'Internal Server Error' })
    }
  }
}
