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

/** Error handling */
app.use((_, res) => {
  const { message } = new Error('not found')
  return res.status(404).json({ message })
})

const PORT = 6060
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`))
