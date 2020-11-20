import winston from 'winston';
import { Option, LoggerConfig, Transport, WinstonLogLevels } from './types';
import { coloredConsoleTransport, simpleConsoleTransport } from './transports';
import {
  UnknownTransportError,
  MissingConfigurationError,
  MissingNodeEnvironmentError,
} from './errors';

export function newLogger(transports: winston.transport[]): winston.Logger {
  return winston.createLogger({
    level: 'info',
    levels: WinstonLogLevels,
    format: winston.format.json(),
    // TODO: populate other metadata
    // defaultMeta: {
    //   service: 'dont-forget-to-update-default-meta',
    //   otherKeys: 'test',
    // },
    transports: transports,
    // transports: [
    //   // FIXME: confirm this is what we want with the wider engineering team; is this the right name? Is this the right location to output the log files?
    //   new winston.transports.File({ filename: 'error.log', level: 'error' }),
    //   new winston.transports.File({ filename: 'combined.log' }),
    // ],
  });
}

export function configToTransports(options: LoggerConfig): winston.transport[] {
  const nodeEnv: Option<string> = process.env.NODE_ENV?.toLowerCase();

  if (!nodeEnv) {
    throw new MissingNodeEnvironmentError('NODE_ENV variable must be set');
  }

  // Find the config for the current environment
  const environments = options.environments.filter(
    (env) => env.nodeEnvName.toLowerCase() === nodeEnv
  );

  if (environments.length === 0) {
    throw new MissingConfigurationError(
      `There is no configuration for the '${nodeEnv}' environment.`
    );
  }

  const transports: winston.transport[] = [];

  environments[0].transportConfigs.forEach((config) => {
    switch (config.transportType) {
      case Transport.SimpleConsole:
        transports.push(simpleConsoleTransport(config.minimumLogLevel));
        break;
      case Transport.ColoredConsole:
        transports.push(coloredConsoleTransport(config.minimumLogLevel));
        break;
      default:
        throw new UnknownTransportError(
          `Transport type '${config.transportType}' has not been mapped yet`
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
