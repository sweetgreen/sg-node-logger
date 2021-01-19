import { RawJSONConsoleTransportConfig } from '.';
import {
  Environment,
  LogLevel,
  EnvironmentConfig,
  ColorizedConsoleTransportConfig,
  SimpleConsoleTransportConfig,
} from './types';

/**
 * Predefined configuration using simple consoles in all environments
 *
 * Setup
 * - Production: ColorizedConsole - Info
 * - PreProduction: ColorizedConsole - Info
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
    {
      nodeEnvironmentName: Environment.Local,
      transports: {
        simpleConsole: [
          {
            minimumLogLevel: LogLevel.Info,
          } as SimpleConsoleTransportConfig,
        ],
      },
    },
    ,
  ];
}

/**
 * Predefined configuration using colorized consoles in all environments
 *
 * Setup
 * - Production: ColorizedConsole - Info
 * - PreProduction: ColorizedConsole - Info
 */
export function colorizedConsoleConfig(): EnvironmentConfig[] {
  return [
    {
      nodeEnvironmentName: Environment.Production,
      transports: {
        colorizedConsole: [
          {
            minimumLogLevel: LogLevel.Info,
          } as ColorizedConsoleTransportConfig,
        ],
      },
    },
    {
      nodeEnvironmentName: Environment.Development,
      transports: {
        colorizedConsole: [
          {
            minimumLogLevel: LogLevel.Info,
          } as ColorizedConsoleTransportConfig,
        ],
      },
    },
    {
      nodeEnvironmentName: Environment.Local,
      transports: {
        colorizedConsole: [
          {
            minimumLogLevel: LogLevel.Info,
          } as ColorizedConsoleTransportConfig,
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
//  * - PreProduction: ColorizedConsole - Info
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
//         } as ColorizedConsoleConfig,
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
export function rawJSONConsoleConfig(): EnvironmentConfig[] {
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
