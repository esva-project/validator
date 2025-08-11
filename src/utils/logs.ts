import winston from 'winston'

const logger = {
  iia: winston.createLogger({
    format: winston.format.simple(),
    transports: [
      new winston.transports.File({
        filename:
          'logs/IIA_' +
          new Date().getUTCDate() +
          '-' +
          (new Date().getUTCMonth() + 1) +
          '-' +
          new Date().getUTCFullYear() +
          '.log'
      })
    ]
  }),
  ola: winston.createLogger({
    format: winston.format.simple(),
    transports: [
      new winston.transports.File({
        filename:
          'logs/OLA_' +
          new Date().getUTCDate() +
          '-' +
          (new Date().getUTCMonth() + 1) +
          '-' +
          new Date().getUTCFullYear() +
          '.log'
      })
    ]
  })
}

export { logger }
