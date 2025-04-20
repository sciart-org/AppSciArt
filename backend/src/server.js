import 'dotenv/config'
import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { editionsRouter } from './routes/editions.js'
import { sequelize } from './config/sequelize.js'

import './models/database/Edition.js'

const app = express()

const PORT = process.env.PORT || 3000

app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware())

app.get('/', (req, res) => {
  res.send('AppSciArt backend ')
})

app.use('/editions', editionsRouter)

sequelize.authenticate().then(() => {
  app.listen(PORT, () => console.log(`Database connected successfully and app listening on port ${PORT}`))
})
  .catch((error) => {
    console.log(error.message)
  })

sequelize.sync({ force: true })
