import 'dotenv/config'
import db from './models/index.js'
import http from 'http'
import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { sequelize } from './config/sequelize.js'
import { initialize } from '@oas-tools/core'
import { bearerJwt } from '@oas-tools/auth/handlers'
import { customErrorHandler } from './middlewares/customErrorHandler.js'
import { initializeWebSockets } from './sockets/index.js'

const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET
const JWT_ISSUER = process.env.JWT_ISSUER

const app = express()
const server = http.createServer(app)

app.disable('x-powered-by')
app.use(json({ limit: '50mb' }))
app.use(corsMiddleware())
app.use(customErrorHandler)

initializeWebSockets(server)

const config = {
  middleware: {
    security: {
      auth: {
        bearerAuth: bearerJwt({ issuer: JWT_ISSUER, secret: JWT_SECRET })
      }
    }
  }
}

initialize(app, config).then(() => {
  sequelize.authenticate().then(() => {
    server.listen(PORT, () => {
      console.log('\nApp running at http://localhost:' + PORT)
      console.log('________________________________________________________________')
      if (!config?.middleware?.swagger?.disable) {
        console.log('API docs (Swagger UI) available on http://localhost:' + PORT + '/docs')
        console.log('________________________________________________________________')
      }
    })
  })
    .catch((error) => {
      console.log(error.message)
    })
})
