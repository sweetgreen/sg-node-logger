"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawJSONConsoleConfig = exports.colorizedConsoleConfig = exports.simpleConsoleConfig = void 0;
var types_1 = require("./types");
/**
 * Predefined configuration using simple consoles in all environments
 */
function simpleConsoleConfig() {
    return [
        {
            nodeEnvironmentName: types_1.Environment.All,
            transports: {
                simpleConsole: [
                    {
                        minimumLogLevel: types_1.LogLevel.Info,
                    },
                ],
            },
        },
    ];
}
exports.simpleConsoleConfig = simpleConsoleConfig;
/**
 * Predefined configuration using colorized consoles in all environments
 */
function colorizedConsoleConfig() {
    return [
        {
            nodeEnvironmentName: types_1.Environment.All,
            transports: {
                colorizedConsole: [
                    {
                        minimumLogLevel: types_1.LogLevel.Info,
                    },
                ],
            },
        },
    ];
}
exports.colorizedConsoleConfig = colorizedConsoleConfig;
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
 */
function rawJSONConsoleConfig() {
    return [
        {
            nodeEnvironmentName: types_1.Environment.All,
            transports: {
                rawJSONConsole: [
                    {
                        minimumLogLevel: types_1.LogLevel.Info,
                    },
                ],
            },
        },
    ];
}
exports.rawJSONConsoleConfig = rawJSONConsoleConfig;
//# sourceMappingURL=configs.js.map