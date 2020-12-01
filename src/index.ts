// NOTE: Special case to allow 'any' in the helper functions ONLY.
// We want to support the passing of any shape for custom data.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import dotenv from 'dotenv';
import winston from 'winston';

import {
  AwsCloudwatchTransportConfig,
  SimpleConsoleTransportConfig,
  PrettyConsoleTransportConfig,
  LogEntry,
  LoggerOptions,
  LogLevel,
  Transport,
} from './types';
import { newLogger, getTransports } from './helpers';
import { simpleConsoleConfig, prettyConsoleConfig } from './configs';
import { SgNodeLoggerError } from './errors';

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
    : getTransports(appName, prettyConsoleConfig());

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
    throw new SgNodeLoggerError(
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

// const loggerOptionsWithCreds = {
//   environments: [
//     {
//       nodeEnvironmentName: 'production',
//       transports: [
//         {
//           minimumLogLevel: LogLevel.Info,
//           awsRegion: 'us-east-1',
//           logGroupName: '/Sg-Node-Logger/Dev',
//           accessKeyId: '<aws-access-key-id-goes-here>',
//           secretAccessKey: '<aws-secret-access-key-goes-here>',
//           uploadRateInMilliseconds: 1000,
//           retentionInDays: 1,
//         } as AwsCloudwatchTransportConfig,
//       ],
//     },
//     {
//       nodeEnvironmentName: 'development',
//       transports: [
//         {
//           type: Transport.PrettyConsole,
//           minimumLogLevel: LogLevel.Debug,
//         },
//       ],
//     },
//   ],
// };
// initLogger('sg-node-logger', loggerOptionsWithCreds);

// const loggerOptionsWithoutCreds = {
//   environments: [
//     {
//       nodeEnvironmentName: 'production',
//       transports: [
//         {
//           type: Transport.AwsCloudWatch,
//           minimumLogLevel: LogLevel.Info,
//           awsRegion: 'us-east-1',
//           logGroupName: '/Sg-Node-Logger/Dev',
//           uploadRateInMilliseconds: 1000,
//           retentionInDays: 14,
//         } as AwsCloudwatchTransportConfig,
//       ],
//     },
//     {
//       nodeEnvironmentName: 'development',
//       transports: [
//         {
//           type: Transport.PrettyConsole,
//           minimumLogLevel: LogLevel.Debug,
//         },
//       ],
//     },
//   ],
// };
// initLogger('sg-node-logger', loggerOptionsWithoutCreds);

// logDebug('testing debug');
// logVerbose('testing verbose');
// logInfo('testing info', { a: 'jfkkjflsd', b: 137843 });
// logWarn('testing warn', undefined, ['tag1', 'tag2']);
// logError('testing error');

export {
  // logger functions
  initLogger,
  LoggerOptions,
  // enums
  Transport,
  LogLevel,
  // interfaces
  AwsCloudwatchTransportConfig,
  SimpleConsoleTransportConfig,
  PrettyConsoleTransportConfig,
  // pre-defined configs
  prettyConsoleConfig,
  simpleConsoleConfig,
  // helper functions
  logDebug,
  logVerbose,
  logInfo,
  logWarn,
  logError,
};
