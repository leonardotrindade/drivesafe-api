'use strict';

import * as winston from 'winston';

const logEnabled = process.env.LOG_ENABLED || 'true';
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: winston.format.simple()
});

if (logEnabled === 'true') {
  logger.add(new winston.transports.Console());
}

export default logger;
