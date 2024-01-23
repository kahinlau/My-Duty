"use strict";

import { createLogger, format, transports } from 'winston';

/** @function
 * @name logger
 * Logger function provided by winston
*/
const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      filename: './logs/server.log',
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        format.align(),
        format.printf(
          info => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
      ),
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    })
  ],
});

export default logger;
