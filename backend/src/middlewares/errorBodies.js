import { randomUUID } from 'node:crypto'
import { STATUS_CODES } from 'node:http'

const INTERNAL_ERROR_MESSAGE = 'Internal Server Error'

export const isProduction = () => process.env.NODE_ENV === 'production'

const visibleMessageOf = (error) =>
  isProduction() ? INTERNAL_ERROR_MESSAGE : (error?.message || INTERNAL_ERROR_MESSAGE)

export const isInternalError = (error) => !error?.status || error.status >= 500

export const expectedErrorBody = (error) => ({ error: error.message || STATUS_CODES[error.status] })

export const internalErrorBody = (error) => {
  const errorId = randomUUID()
  console.error(`Internal error ${errorId}:`, error)
  return { error: visibleMessageOf(error), errorId }
}
