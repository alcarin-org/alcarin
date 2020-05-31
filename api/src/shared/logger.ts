import { createLogger, format, transports, addColors } from 'winston';

import { envVars } from './envVars';

export const CustomLoggerLevels = {
  debug: 0,
  info: 1,
  queue: 2,
  db: 3,
  warn: 4,
  error: 5,
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
    silent: envVars.NODE_ENV === 'test',
  });

  const errorStackFormat = format.printf(info => {
    const reqUrl = info.config ? `\n\n${info.config.url}\n` : '';

    const msg = info.stack ? info.stack : `[${info.level}]: ${info.message}`;
    const timestampedMessage = `${info.timestamp} ${msg}`;
    return timestampedMessage + reqUrl;
  });

  const consoleTransport = new transports.Console({
    level: 'error',
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
