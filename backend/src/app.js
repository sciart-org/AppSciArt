import './models/index.js'
import http from 'http'
import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { initialize } from '@oas-tools/core'
import { accessTokenVerifierFromEnv } from './middlewares/accessTokens.js'
import { customErrorHandler } from './middlewares/customErrorHandler.js'
import { initializeWebSockets } from './sockets/index.js'
import { expectedErrorBody, internalErrorBody, isInternalError, isProduction } from './middlewares/errorBodies.js'

const sendUnhandledError = (error, send) => {
  if (isInternalError(error)) return send(500, internalErrorBody(error))
  send(error.status, expectedErrorBody(error))
}

export const createApp = async () => {
  const verifyAccessToken = accessTokenVerifierFromEnv()

  const app = express()
  const server = http.createServer(app)

  app.disable('x-powered-by')
  app.use(json({ limit: '50mb' }))
  app.use(corsMiddleware())
  app.use(customErrorHandler)

  const io = initializeWebSockets(server, verifyAccessToken)

  const config = {
    middleware: {
      security: {
        auth: {
          bearerAuth: verifyAccessToken
        }
      },
      error: {
        customHandler: sendUnhandledError,
        printStackTrace: !isProduction()
      }
    }
  }

  await initialize(app, config)

  return { app, server, io, config }
}
