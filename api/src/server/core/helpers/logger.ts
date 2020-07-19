import { createLogger, format, transports, addColors } from 'winston';

import { envVars } from '../env-vars';

export const CustomLoggerLevels = {
  debug: 5,
  info: 4,
  queue: 3,
  db: 2,
  warn: 1,
  error: 0,
};

addColors({
  debug: 'gray bold',
  info: 'cyan bold',
  queue: 'magenta bold',
  db: 'green bold',
  warn: 'yellow bold',
  error: 'red bold',
});

function createWinstonLogger() {
  const winstonLogger = createLogger({
    level: envVars.LOG_LEVEL,
    levels: CustomLoggerLevels,
    format: format.errors({ stack: true }),
    silent: envVars.LOG_SILENT,
  });

  const errorStackFormat = format.printf(info => {
    const reqUrl = info.config ? `\n\n${info.config.url}\n` : '';

    const msg = info.stack ? info.stack : `[${info.level}]: ${info.message}`;
    const timestampedMessage = `${info.timestamp} ${msg}`;
    return timestampedMessage + reqUrl;
  });

  const consoleTransport = new transports.Console({
    level: envVars.LOG_LEVEL,
    format: format.combine(
      format.colorize(),
      format.simple(),
      format.timestamp(),
      errorStackFormat
    ),
  });
  winstonLogger.add(consoleTransport);

  const logger = {
    debug: winstonLogger.debug.bind(winstonLogger),
    info: winstonLogger.info.bind(winstonLogger),
    warn: winstonLogger.warn.bind(winstonLogger),
    error: winstonLogger.error.bind(winstonLogger),
    queue: (message: string) => {
      winstonLogger.log('queue', message);
    },
    db: (message: string) => {
      winstonLogger.log('db', message);
    },
  };
  return logger;
}

export const logger = createWinstonLogger();
