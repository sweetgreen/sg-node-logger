import { Environment, LogLevel, Transport, LoggerOptions } from './types';

/**
 * Uses the PrettyConsole with Info log level across all
 * environments
 */
export function defaultConfig(): LoggerOptions {
  return {
    environments: [
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
    ],
  };
}
