import 'dotenv/config'
import http from 'http'
import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { sequelize } from './config/sequelize.js'
import { initialize } from '@oas-tools/core'
import { bearerJwt } from '@oas-tools/auth/handlers'
import './models/relations.js'

const app = express()

const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET
const JWT_ISSUER = process.env.JWT_ISSUER

function customErrorHandler (req, res, next) {
  const oldSend = res.send

  res.send = function (data) {
    res.send = oldSend

    if (!(data.error && typeof data.error === 'string' && data.error.includes('RequestValidationError'))) {
      return res.send(data)
    }

    const lines = data.error?.split('\n')
    let userMessage = ''

    for (const line of lines) {
      const match = line.match(/#\/(?:anyOf\/\d+\/)?properties\/([^\/\s]+)\/?[^ ]* > (.+)/)
      if (match) {
        const [_, field, message] = match
        const friendlyField = field.charAt(0).toUpperCase() + field.slice(1)
        if (!userMessage.includes(`${friendlyField} ${message}. `)) {
          userMessage += `${friendlyField} ${message}. `
        }
      }
    }
    return res.send({
      error: userMessage
    })
  }
  next()
}

app.disable('x-powered-by')
app.use(json({ limit: '50mb' }))
app.use(corsMiddleware())
app.use(customErrorHandler)

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
    http.createServer(app).listen(PORT, () => {
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
