// NOTE: Special case to allow 'any' in the helper functions ONLY.
// We want to support the passing of any shape for custom data.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import dotenv from 'dotenv';
import winston from 'winston';

import {
  AwsCloudwatchTransportConfig,
  LogEntry,
  LoggerOptions,
  LogLevel,
  Transport,
} from './types';
import { newLogger, convertConfigToTransports } from './helpers';
import { prettyConsoleTransport, simpleConsoleTransport } from './transports';
import { defaultConfig } from './configs';
import { SgNodeLoggerError } from './errors';

// Init dotenv
dotenv.config();

let logger: winston.Logger;

/**
 * Initializes the logger. Uses default configuration if none is passed.
 *
 * @param options logger options/config
 */
function initLogger(options?: LoggerOptions): void {
  const transports = options
    ? convertConfigToTransports(options.environments)
    : convertConfigToTransports(defaultConfig());

  logger = newLogger(transports);

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

const loggerOptions = {
  environments: [
    {
      nodeEnvironmentName: 'production',
      transports: [
        {
          type: Transport.AwsCloudwatch,
          // minimumLogLevel: LogLevel.Info,
          awsRegion: 'us-east-1',
          logGroupName: '/Sg-Node-Logger/Dev',
          applicationName: 'sg-node-logger',
          accessKeyId: 'AKIAQTBZ6QEQR34FG6BS',
          secretAccessKey: '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',
          // uploadRateInMilliseconds: 1000,
          // retentionInDays: 1,
        } as AwsCloudwatchTransportConfig,
      ],
    },
    {
      nodeEnvironmentName: 'development',
      transports: [
        {
          type: Transport.PrettyConsole,
          minimumLogLevel: LogLevel.Info,
        },
      ],
    },
  ],
};

initLogger(loggerOptions);

// logDebug('testing debug');
// logVerbose('testing verbose');
logInfo('testing info', { a: 'jfkkjflsd', b: 137843 });
// logWarn('testing warn', undefined, ['tag1', 'tag2']);
// logError('testing error');

export {
  LoggerOptions,
  initLogger,
  // transports
  prettyConsoleTransport,
  simpleConsoleTransport,
  // pre-defined configs
  // helper functions
  logDebug,
  logVerbose,
  logInfo,
  logWarn,
  logError,
};
