// NOTE: Special case to allow 'any' in the helper functions ONLY.
// We want to support the passing of any shape for custom data.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import dotenv from 'dotenv';
import winston from 'winston';

import { DynamicLogMetadata, LogEntry, LoggerOptions, LogLevel } from './types';
import { defaultLogger, convertConfigToTransports } from './helpers';
import { prettyConsoleTransport, simpleConsoleTransport } from './transports';

// Init dotenv
dotenv.config();

/**
 * Logger object initialized with default transports,
 * unless they are overwritten by configureLoggeer()
 */
const logger: winston.Logger = defaultLogger();

/**
 * Overwrites logger configuration (transports, etc)
 *
 * @param options custom options to configure the transports
 * per environment
 */
function configureLogger(options: LoggerOptions): void {
  logger.transports = convertConfigToTransports(options);
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
  // TODO:
  // const metadata: DynamicLogMetadata = {
  //   utcTimestamp: new Date().toISOString(),
  //   sessionId: 'uuid',
  //   correlationId: 'uuid',
  // };

  const { logLevel, message, ...otherFields } = log;

  const level: string = LogLevel[logLevel].toLowerCase();

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

// Test Only
// logDebug('testing debug');
// logVerbose('testing verbose');
// logInfo('testing info', { a: 'jfkkjflsd', b: 137843 });
// logWarn('testing warn', undefined, ['tag1', 'tag2']);
// logError('testing error');

export {
  LoggerOptions,
  configureLogger,
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
