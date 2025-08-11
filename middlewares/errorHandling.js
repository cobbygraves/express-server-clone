const winston = require('winston')

// Logger setup
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'error.log' })]
})

// Async handler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = { asyncHandler, logger }
