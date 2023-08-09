#!/usr/bin/env node

import express from 'express'
import morgan from 'morgan'

import statsController from './controller/statsController' // Import the statsController module
import routes from './routes/validationRoutes'

const app = express()
const logsApp = express() // New Express app for /logs endpoint

/** Logging */
app.use(morgan('dev'))
/** Parse the request */
app.use(express.urlencoded({ extended: false }))
/** Takes care of JSON data */
app.use(express.json())

/** Routes */
app.use('/', routes.router)

// Define the /logs endpoint on the new app and start on port 4000
logsApp.get('/logs', statsController.logs)

// Set the port for the /logs app
const LOGS_PORT = 4000
logsApp.listen(LOGS_PORT, () => {
  console.log(`Logs app is running on port ${LOGS_PORT}`)
})

/** Error handling */
app.use((_, res) => {
  const { message } = new Error('not found')
  return res.status(404).json({ message })
})

const MAIN_PORT = 6060
app.listen(MAIN_PORT, () => {
  console.log(`Main app is running on port ${MAIN_PORT}`)
})
