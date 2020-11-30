import {
  Environment,
  LogLevel,
  Transport,
  EnvironmentConfig,
  AwsCloudwatchTransportConfig,
} from './types';

/**
 * Default predefined configuration
 *
 * Setup
 * - Production: PrettyConsole - Info
 * - PreProduction: PrettyConsole - Info
 */
export function defaultConfig(): EnvironmentConfig[] {
  return [
    {
      nodeEnvironmentName: Environment.Production,
      transports: [
        {
          type: Transport.PrettyConsole,
          minimumLogLevel: LogLevel.Info,
        },
      ],
    },
    {
      nodeEnvironmentName: Environment.PreProduction,
      transports: [
        {
          type: Transport.PrettyConsole,
          minimumLogLevel: LogLevel.Info,
        },
      ],
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
//           type: Transport.AwsCloudwatch,
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
//       nodeEnvironmentName: Environment.PreProduction,
//       transports: [
//         {
//           type: Transport.PrettyConsole,
//           minimumLogLevel: LogLevel.Info,
//         },
//       ],
//     },
//   ];
// }
