import winston from 'winston';

import { Option, LoggerOptions, Transport } from './types';
import { prettyConsoleTransport, simpleConsoleTransport } from './transports';
import { defaultConfig } from './configs';
import {
  UnknownTransportError,
  MissingConfigurationError,
  MissingEnvironmentVariableError,
} from './errors';

export function newLogger(transports: winston.transport[]): winston.Logger {
  // TODO: get values for type StaticLogMetadata

  return winston.createLogger({
    silent: false,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    // TODO: populate other metadata
    defaultMeta: {
      service: 'dont-forget-to-update-default-meta',
      otherKeys: 'test',
    },
    transports: transports,
    // transports: [
    //   // FIXME: confirm this is what we want with the wider engineering team; is this the right name? Is this the right location to output the log files?
    //   new winston.transports.File({ filename: 'error.log', level: 'error' }),
    //   new winston.transports.File({ filename: 'combined.log' }),
    // ],
  });
}

/**
 * New instance of the logger using default transports
 */
export function defaultLogger(): winston.Logger {
  const transports = convertConfigToTransports(defaultConfig());

  return newLogger(transports);
}

/**
 * Converts options to transports
 *
 * @param options the options to convert
 */
export function convertConfigToTransports(
  options: LoggerOptions
): winston.transport[] {
  const nodeEnv: Option<string> = process.env.NODE_ENV?.trim().toLowerCase();

  if (!nodeEnv) {
    throw new MissingEnvironmentVariableError('NODE_ENV variable must be set');
  }

  // Find the config for the current environment
  const environments = options.environments.filter(
    (env) => env.nodeEnvName.trim().toLowerCase() === nodeEnv
  );

  if (environments.length === 0) {
    throw new MissingConfigurationError(
      `There is no configuration for the '${nodeEnv}' environment.`
    );
  }

  const currentEnvironmentConfig = environments[0];

  if (currentEnvironmentConfig.transports.length === 0) {
    throw new MissingConfigurationError(
      `'transports' are missing for the '${nodeEnv}' environment.`
    );
  }

  const transports: winston.transport[] = [];

  // Get transports
  currentEnvironmentConfig.transports.forEach((config) => {
    switch (config.type) {
      case Transport.SimpleConsole:
        transports.push(simpleConsoleTransport(config.minimumLogLevel));
        break;
      case Transport.PrettyConsole:
        transports.push(prettyConsoleTransport(config.minimumLogLevel));
        break;
      default:
        throw new UnknownTransportError(
          `Transport type '${config.type}' has not been mapped yet`
        );
    }
  });

  return transports;
}

// function newLogger(transports: winston.transport[]): winston.Logger {
//   return winston.createLogger({
//     level: 'info',
//     // levels: ,
//     format: winston.format.json(),
//     defaultMeta: {
//       service: 'dont-forget-to-update-default-meta',
//       otherKeys: 'test',
//     },
//     transports: transports,
//     // transports: [
//     //   // FIXME: confirm this is what we want with the wider engineering team; is this the right name? Is this the right location to output the log files?
//     //   new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     //   new winston.transports.File({ filename: 'combined.log' }),
//     // ],
//   });
// }

// function configToTransports(options: LoggerOptions): winston.transport[] {
//   const nodeEnv: Option<string> = process.env.NODE_ENV?.toLowerCase();

//   if (!nodeEnv) {
//     throw new MissingNodeEnvironmentError('NODE_ENV variable must be set');
//   }

//   // Find the config for the current environment
//   const environments = options.environments.filter(
//     (env) => env.nodeEnvName.toLowerCase() === nodeEnv
//   );

//   if (environments.length === 0) {
//     throw new MissingConfigurationError(
//       `There is no configuration for the '${nodeEnv}' environment.`
//     );
//   }

//   const transports: winston.transport[] = [];

//   environments[0].transportConfigs.forEach((config) => {
//     switch (config.transportType) {
//       case Transport.SimpleConsole:
//         transports.push(simpleConsoleTransport(config.minimumLogLevel));
//         break;
//       case Transport.ColoredConsole:
//         transports.push(coloredConsoleTransport(config.minimumLogLevel));
//         break;
//       default:
//         throw new UnknownTransportError(
//           `Transport type '${config.transportType}' has not been mapped yet`
//         );
//     }
//   });

//   return transports;
// }

// NOTE: we can configure an already created logger by doing sgLogger.configure({...})

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// if (process.env.NODE_ENV !== 'production') {
//   sgLogger.add(simpleConsoleTransport());
// }
