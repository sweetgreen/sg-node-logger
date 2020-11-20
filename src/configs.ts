import { Environment, LogLevel, Transport, LoggerConfig } from './types';

export function defaultConfig(): LoggerConfig {
  return {
    environments: [
      {
        nodeEnvName: Environment.Production,
        transports: [
          {
            type: Transport.SimpleConsole,
            minimumLogLevel: LogLevel.Info,
          },
        ],
      },
      {
        nodeEnvName: Environment.PreProduction,
        transports: [
          {
            type: Transport.SimpleConsole,
            minimumLogLevel: LogLevel.Info,
          },
        ],
      },
    ],
  };
}

// export function coloredConsoleConfig(): LoggerConfig {
//   // TODO
// }
