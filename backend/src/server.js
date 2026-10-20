import 'dotenv/config'
import { sequelize } from './config/sequelize.js'
import { createApp } from './app.js'

const PORT = process.env.PORT || 3000

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err)
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err)
  process.exit(1)
})

try {
  const { server, config } = await createApp()
  await sequelize.authenticate()
  server.listen(PORT, () => {
    console.log('\nApp running at http://localhost:' + PORT)
    console.log('________________________________________________________________')
    if (!config?.middleware?.swagger?.disable) {
      console.log('API docs (Swagger UI) available on http://localhost:' + PORT + '/docs')
      console.log('________________________________________________________________')
    }
  })
} catch (err) {
  console.error('Startup failed:', err)
  process.exit(1)
}
