import { RawJSONConsoleTransportConfig } from '.';
import {
  Environment,
  LogLevel,
  EnvironmentConfig,
  PrettyConsoleTransportConfig,
  SimpleConsoleTransportConfig,
} from './types';

/**
 * Predefined configuration using simple consoles in all environments
 *
 * Setup
 * - Production: PrettyConsole - Info
 * - PreProduction: PrettyConsole - Info
 */
export function simpleConsoleConfig(): EnvironmentConfig[] {
  return [
    {
      nodeEnvironmentName: Environment.Production,
      transports: {
        simpleConsole: [
          {
            minimumLogLevel: LogLevel.Info,
          } as SimpleConsoleTransportConfig,
        ],
      },
    },
    {
      nodeEnvironmentName: Environment.Development,
      transports: {
        simpleConsole: [
          {
            minimumLogLevel: LogLevel.Info,
          } as SimpleConsoleTransportConfig,
        ],
      },
    },
  ];
}

/**
 * Predefined configuration using pretty consoles in all environments
 *
 * Setup
 * - Production: PrettyConsole - Info
 * - PreProduction: PrettyConsole - Info
 */
export function prettyConsoleConfig(): EnvironmentConfig[] {
  return [
    {
      nodeEnvironmentName: Environment.Production,
      transports: {
        prettyConsole: [
          {
            minimumLogLevel: LogLevel.Info,
          } as PrettyConsoleTransportConfig,
        ],
      },
    },
    {
      nodeEnvironmentName: Environment.Development,
      transports: {
        prettyConsole: [
          {
            minimumLogLevel: LogLevel.Info,
          } as PrettyConsoleTransportConfig,
        ],
      },
    },
  ];
}

// /**
//  * Simple predefined configuration
//  *
//  * Setup:
//  * - Production: AwsCloudWatch - Info
//  * - PreProduction: PrettyConsole - Info
//  */
// export function simplePredefinedConfig(): EnvironmentConfig[] {
//   return [
//     {
//       nodeEnvironmentName: Environment.Production,
//       transports: [
//         {
//           type: Transport.AwsCloudWatch,
//           minimumLogLevel: LogLevel.Info,
//           awsRegion: '',
//           logGroupName: '',
//           applicationName: '',
//           accessKeyId: '',
//           secretAccessKey: '',
//           uploadRateInMilliseconds: 1000,
//           retentionInDays: 180,
//         } as AwsCloudwatchTransportConfig,
//       ],
//     },
//     {
//       nodeEnvironmentName: Environment.Development,
//       transports: [
//         {
//           minimumLogLevel: LogLevel.Info,
//         } as PrettyConsoleConfig,
//       ],
//     },
//   ];
// }

/**
 * Predefined configuration using raw JSON consoles in all environments
 *
 * Setup
 * - Production: RawJSONConsole - Info
 * - PreProduction: RawJSONConsole - Info
 */
export function basicJSONConsole(): EnvironmentConfig[] {
  return [
    {
      nodeEnvironmentName: Environment.Production,
      transports: {
        rawJSONConsole: [
          {
            minimumLogLevel: LogLevel.Info,
          } as RawJSONConsoleTransportConfig,
        ],
      },
    },
    {
      nodeEnvironmentName: Environment.Development,
      transports: {
        rawJSONConsole: [
          {
            minimumLogLevel: LogLevel.Info,
          } as RawJSONConsoleTransportConfig,
        ],
      },
    },
  ];
}
