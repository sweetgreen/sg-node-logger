import winston from 'winston';
import { ConsoleTransportInstance } from 'winston/lib/winston/transports';

import { LogLevel } from './types';

/**
 * Basic console stdout
 *
 * @example info: testing info {"data":{},"timestamp":"2020-11-21T06:24:06.048Z"}
 *
 * @param minimumLogLevel all logs with this severity and above
 * will be enabled; default is Info
 */
export function simpleConsoleTransport(
  minimumLogLevel: LogLevel = LogLevel.Info
): ConsoleTransportInstance {
  return new winston.transports.Console({
    level: LogLevel[minimumLogLevel].toLowerCase(),
    format: winston.format.simple(),
  });
}

/**
 * Colored console stdout
 *
 * @example [SGLOG]  2020-11-20 10:26:22.866  info : testing info
 *
 * @param minimumLogLevel all logs with this severity and above
 * will be enabled; default is Info
 */
export function prettyConsoleTransport(
  minimumLogLevel: LogLevel = LogLevel.Info
): ConsoleTransportInstance {
  const formatting = winston.format.combine(
    winston.format.colorize({
      all: true,
    }),
    winston.format.label({
      label: '[SGLOG]',
    }),
    winston.format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS',
    }),
    winston.format.printf(
      (info) =>
        `${info.label}  ${info.timestamp}  ${info.level} : ${info.message} ${
          info.data || info.tags || info.errorMessage || info.errorStack
            ? JSON.stringify({
                data: info.data,
                tags: info.tags,
                errorMessage: info.errorMessage,
                errorStack: info.errorStack,
              })
            : ''
        }`
    )
  );

  return new winston.transports.Console({
    level: LogLevel[minimumLogLevel].toLowerCase(),
    format: winston.format.combine(winston.format.colorize(), formatting),
  });
}

// export function awsCloudWatchTransport(
//   minimumLogLevel: LogLevel = LogLevel.Info
// );
