import 'dotenv/config'
import http from 'http'
import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { sequelize } from './config/sequelize.js'
import { initialize } from '@oas-tools/core'

const app = express()

const PORT = process.env.PORT || 3000

app.disable('x-powered-by')
app.use(json({ limit: '50mb' }))
app.use(corsMiddleware())

const config = {
  middleware: {
    security: {
      auth: {
        bearerAuth: () => { /* no-op */ }
      }
    }
  }
}

initialize(app, config).then(() => {
  sequelize.authenticate().then(() => {
    sequelize.sync({ force: true })
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
