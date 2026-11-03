import './models/index.js'
import http from 'http'
import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { initialize } from '@oas-tools/core'
import { bearerJwt } from '@oas-tools/auth/handlers'
import { customErrorHandler } from './middlewares/customErrorHandler.js'
import { initializeWebSockets } from './sockets/index.js'

export const createApp = async () => {
  const JWT_SECRET = process.env.JWT_SECRET
  const JWT_ISSUER = process.env.JWT_ISSUER

  const app = express()
  const server = http.createServer(app)

  app.disable('x-powered-by')
  app.use(json({ limit: '50mb' }))
  app.use(corsMiddleware())
  app.use(customErrorHandler)

  const io = initializeWebSockets(server)

  const config = {
    middleware: {
      security: {
        auth: {
          bearerAuth: bearerJwt({
            issuer: JWT_ISSUER,
            secret: JWT_SECRET
          })
        }
      }
    }
  }

  await initialize(app, config)

  return { app, server, io, config }
}
