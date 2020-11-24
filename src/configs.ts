import { Environment, LogLevel, Transport, EnvironmentConfig } from './types';

/**
 * Uses the PrettyConsole with Info log level across all
 * environments
 */
export function defaultConfig(): EnvironmentConfig[] {
  return [
    {
      nodeEnvName: Environment.Production,
      transports: [
        {
          type: Transport.PrettyConsole,
          minimumLogLevel: LogLevel.Info,
        },
      ],
    },
    {
      nodeEnvName: Environment.PreProduction,
      transports: [
        {
          type: Transport.PrettyConsole,
          minimumLogLevel: LogLevel.Info,
        },
      ],
    },
  ];
}
