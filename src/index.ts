// NOTE: Special case to allow 'any' in the helper functions ONLY.
// We want to support the passing of any shape for custom data.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import dotenv from 'dotenv';
import winston from 'winston';

import {
  AwsCloudWatchTransportConfig,
  SimpleConsoleTransportConfig,
  ColorizedConsoleTransportConfig,
  RawJSONConsoleTransportConfig,
  LogEntry,
  LoggerOptions,
  LogLevel,
} from './types';
import { newLogger, getTransports } from './helpers';
import {
  simpleConsoleConfig,
  colorizedConsoleConfig,
  rawJSONConsole,
} from './configs';
import { LoggerError } from './errors';

// Init dotenv
dotenv.config();

let logger: winston.Logger;

/**
 * Initializes the logger. Uses default configuration if none is passed.
 *
 * @param options logger options/config
 */
function initLogger(appName: string, options?: LoggerOptions): void {
  const transports = options?.environments
    ? getTransports(appName, options.environments)
    : getTransports(appName, rawJSONConsole());

  logger = newLogger(appName, transports);

  // PII Warning
  logWarn(
    `Verify PII is removed from all logs! Application security is everyone's responsibility.`,
    undefined,
    ['startup']
  );
}

/**
 * Base log function
 *
 * Note: it's highly recommended to use the helper functions:
 * logDebug, logVerbose, logInfo, logWarn, and logError
 *
 * @param log log object
 */
function log(log: LogEntry): void {
  // TODO: set DynamicLogMetadata
  // const metadata: DynamicLogMetadata = {
  //   utcTimestamp: new Date().toISOString(),
  //   sessionId: 'uuid',
  //   correlationId: 'uuid',
  // };

  const { logLevel, message, ...otherFields } = log;

  const level: string = LogLevel[logLevel].toLowerCase();

  if (!logger) {
    throw new LoggerError(
      `Ensure the logger has been initialized by calling initLogger() at the app's entry point.`
    );
  }

  logger.log(level, message, otherFields);
}

function logDebug(message: string, customData?: any, tags?: string[]): void {
  log({
    logLevel: LogLevel.Debug,
    message: message,
    tags: tags,
    data: customData,
  });
}

function logVerbose(message: string, customData?: any, tags?: string[]): void {
  log({
    logLevel: LogLevel.Verbose,
    message: message,
    tags: tags,
    data: customData,
  });
}

function logInfo(message: string, customData?: any, tags?: string[]): void {
  log({
    logLevel: LogLevel.Info,
    message: message,
    tags: tags,
    data: customData,
  });
}

function logWarn(message: string, customData?: any, tags?: string[]): void {
  log({
    logLevel: LogLevel.Warn,
    message: message,
    tags: tags,
    data: customData,
  });
}

function logError(
  message: string,
  error?: Error,
  customData?: any,
  tags?: string[]
): void {
  log({
    logLevel: LogLevel.Error,
    message: message,
    tags: tags,
    data: customData,
    errorMessage: error?.message,
    errorStack: error?.stack,
  });
}

//
// Test Only
//

// CASE 0: Default
// initLogger('sg-node-logger');

// CASE 1: Simple Console
// const loggerOptions = {
//   environments: [
//     {
//       nodeEnvironmentName: 'production',
//       transports: {
//         simpleConsole: [
//           {
//             minimumLogLevel: LogLevel.Info,
//           } as SimpleConsoleTransportConfig,
//         ],
//       },
//     },
//     {
//       nodeEnvironmentName: 'development',
//       transports: {
//         simpleConsole: [
//           {
//             minimumLogLevel: LogLevel.Info,
//           } as SimpleConsoleTransportConfig,
//         ],
//       },
//     },
//   ],
// };
// initLogger('sg-node-logger', loggerOptions);

// // CASE 2: Colorized Console
// const loggerOptions = {
//   environments: [
//     {
//       nodeEnvironmentName: 'production',
//       transports: {
//         colorizedConsole: [
//           {
//             minimumLogLevel: LogLevel.Info,
//           } as ColorizedConsoleTransportConfig,
//         ],
//       },
//     },
//     {
//       nodeEnvironmentName: 'development',
//       transports: {
//         colorizedConsole: [
//           {
//             minimumLogLevel: LogLevel.Info,
//           } as ColorizedConsoleTransportConfig,
//         ],
//       },
//     },
//   ],
// };
// initLogger('sg-node-logger', loggerOptions);

// // CASE 3: AWS - use credentials
// const loggerOptions = {
//   environments: [
//     {
//       nodeEnvironmentName: 'production',
//       transports: [
//         {
//           minimumLogLevel: LogLevel.Info,
//           awsRegion: 'us-east-1',
//           logGroupName: '/Sg-Node-Logger/Dev',
//           uploadRateInMilliseconds: 1000,
//           retentionInDays: 14,
//         } as AwsCloudWatchTransportConfig,
//       ],
//     },
//     {
//       nodeEnvironmentName: 'development',
//       transports: [
//         {
//           minimumLogLevel: LogLevel.Debug,
//         } as ColorizedConsoleTransportConfig,
//       ],
//     },
//   ],
// };
// initLogger('sg-node-logger', loggerOptions);

// // CASE 4: AWS - pass credentials
// const loggerOptions = {
//   environments: [
//     {
//       nodeEnvironmentName: 'production',
//       transports: {
//         awsCloudWatch: [
//           {
//             minimumLogLevel: LogLevel.Info,
//             awsRegion: 'us-east-1',
//             logGroupName: '/Sg-Node-Logger/Dev',
//             accessKeyId: '<aws-access-key-id-goes-here>',
//             secretAccessKey: '<aws-secret-access-key-goes-here>',
//             uploadRateInMilliseconds: 1000,
//             retentionInDays: 1,
//           } as AwsCloudWatchTransportConfig,
//         ],
//       },
//     },
//     {
//       nodeEnvironmentName: 'development',
//       transports: {
//         colorizedConsole: [
//           {
//             minimumLogLevel: LogLevel.Info,
//           } as ColorizedConsoleTransportConfig,
//         ],
//       },
//     },
//   ],
// };
// initLogger('sg-node-logger', loggerOptions);

// // CASE 4: Run all transports
// const loggerOptions = {
//   environments: [
//     {
//       nodeEnvironmentName: 'development',
//       transports: {
//         simpleConsole: [
//           {
//             minimumLogLevel: LogLevel.Info,
//           } as SimpleConsoleTransportConfig,
//         ],
//         colorizedConsole: [
//           {
//             minimumLogLevel: LogLevel.Info,
//           } as ColorizedConsoleTransportConfig,
//         ],
//         awsCloudWatch: [
//           {
//             minimumLogLevel: LogLevel.Info,
//             awsRegion: 'us-east-1',
//             logGroupName: '/Sg-Node-Logger/Dev',
//             uploadRateInMilliseconds: 1000,
//             retentionInDays: 14,
//           } as AwsCloudWatchTransportConfig,
//         ],
//       },
//     },
//   ],
// };
// initLogger('sg-node-logger', loggerOptions);

// logDebug('testing debug');
// logVerbose('testing verbose');
// logInfo('testing info', { a: 'jfkkjflsd', b: 137843 });
// logWarn('testing warn', undefined, ['tag1', 'tag2']);
// logError('testing error');

export {
  // logger
  initLogger,
  // enums
  LogLevel,
  // interfaces
  LoggerOptions,
  SimpleConsoleTransportConfig,
  ColorizedConsoleTransportConfig,
  AwsCloudWatchTransportConfig,
  RawJSONConsoleTransportConfig,
  // pre-defined configs - more coming soon
  colorizedConsoleConfig,
  simpleConsoleConfig,
  rawJSONConsole,
  // helper functions
  logDebug,
  logVerbose,
  logInfo,
  logWarn,
  logError,
};
