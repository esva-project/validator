#!/usr/bin/env node

import express from 'express'
import morgan from 'morgan'

import routes from './routes/validationRoutes'

const app = express()

/** Logging */
app.use(morgan('dev'))
/** Parse the request */
app.use(express.urlencoded({ extended: false }))
/** Takes care of JSON data */
app.use(express.json())

/** Routes */
app.use('/', routes.router)

// Create a separate HTTPS server for the /logs route
// const logsApp = express()
// logsApp.get('/logs', statsController.logs)

// const logsSslOptions = {
//   cert: fs.readFileSync('./certificates/ssl_certs/fullchain.pem'),
//   key: fs.readFileSync('./certificates/ssl_certs/privkey.pem')
// }

// const logsServer = https.createServer(logsSslOptions, logsApp)
// const LOGS_PORT = 4000
// logsServer.listen(LOGS_PORT, () => {
//   console.log(`Logs app is running on port ${LOGS_PORT}`)
// })

/** Error handling */
app.use((_, res) => {
  const { message } = new Error('not found')
  return res.status(404).json({ message })
})

const MAIN_PORT = 6060
app.listen(MAIN_PORT, () => {
  console.log(`Main app is running on port ${MAIN_PORT}`)
})
