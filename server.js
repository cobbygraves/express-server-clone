const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { logger } = require('./utils/functions')
const { NotFoundError } = require('./utils/customErrors')
require('dotenv').config()

const server = express()

server.use(cookieParser())
server.use(express.json({ limit: '200mb', extended: true }))
server.use(express.urlencoded({ limit: '200mb', extended: true }))
server.use(
  cors({
    origin: [
      'https://yourfrontend.com',
      'http://localhost:4200',
      'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-CSRF-TOKEN']
  })
)

//testing route
server.get('/', (req, res) => {
  res.send('Server is running')
})

//user routes
const usersRoutes = require('./routes/users')
server.use('/user', usersRoutes)

// 404 Handler
server.use((req, res, next) => next(new NotFoundError('Route not found')))

// Centralized error-handling middleware
server.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  logger.error(`${req.method} ${req.url} - ${message}, { stack: err.stack }`)

  const response =
    process.env.NODE_ENV === 'development'
      ? { error: { message, status, stack: err.stack } }
      : { error: { message, status } }

  res.status(status).json(response)
})

// Process-level error handling
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

//server listening at port 5000
const PORT = process.env.PORT || 5000
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URL, (err) => {
  if (!err) {
    server.listen(PORT, (err) => {
      if (err) {
        console.log('Error Listerning @ PORT')
      } else {
        console.log('Connection Successful')
      }
    })
  } else {
    console.log('Error Connecting To Database')
  }
})
