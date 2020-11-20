import { Environment, LogLevel, Transport, LoggerConfig } from './types';

export function defaultConfig(): LoggerConfig {
  return {
    environments: [
      {
        nodeEnvName: Environment.Production,
        transportConfigs: [
          {
            transportType: Transport.SimpleConsole,
            minimumLogLevel: LogLevel.Info,
          },
        ],
      },
      {
        nodeEnvName: Environment.PreProduction,
        transportConfigs: [
          {
            transportType: Transport.SimpleConsole,
            minimumLogLevel: LogLevel.Info,
          },
        ],
      },
    ],
  };
}
