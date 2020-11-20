import winston from 'winston';
import { ConsoleTransportInstance } from 'winston/lib/winston/transports';

import { LogLevel } from './types';

/**
 * Basic console stdout
 *
 * @example INFO: <message> <everything else>
 *
 * @param minimumLogLevel everything above this level is logged - see {LogLevel}
 * enum for more information
 */
export function simpleConsoleTransport(
  minimumLogLevel: LogLevel = LogLevel.Info
): ConsoleTransportInstance {
  return new winston.transports.Console({
    level: minimumLogLevel.toString().toLowerCase(),
    format: winston.format.simple(),
  });
}

/**
 * Colored console stdout
 *
 * @example [LOGGER] - TODO
 *
 * @param minimumLogLevel everything above this level is logged - see {LogLevel}
 * enum for more information
 */
export function coloredConsoleTransport(
  minimumLogLevel: LogLevel = LogLevel.Info
): ConsoleTransportInstance {
  const formatting = winston.format.combine(
    winston.format.colorize({
      all: true,
    }),
    winston.format.label({
      label: '[LOGGER]',
    }),
    winston.format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS',
    }),
    winston.format.printf(
      (info) =>
        ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message} ${
          JSON.stringify(info.logData) ?? ''
        }`
    )
  );

  return new winston.transports.Console({
    level: minimumLogLevel.toString().toLowerCase(),
    format: winston.format.combine(winston.format.colorize(), formatting),
  });
}
