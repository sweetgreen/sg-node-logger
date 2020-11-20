// NOTE: Special case to allow 'any' in the helper functions ONLY.
// We want to support the passing of any shape for custom data.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import dotenv from 'dotenv';
import winston from 'winston';
import { SgLog, LoggerConfig } from './types';
import { defaultConfig } from './configs';
import { newLogger, configToTransports } from './logger';
import { coloredConsoleTransport, simpleConsoleTransport } from './transports';

// Init dotenv
dotenv.config();

const logger: winston.Logger = defaultLogger();

/**
 * New instance of the logger using default transports
 */
function defaultLogger(): winston.Logger {
  const transports = configToTransports(defaultConfig());

  return newLogger(transports);
}

/**
 * Updates the logger transports based on the options/configuration
 *
 * @param options custom options to configure the transports per environment
 */
function configureLogger(options: LoggerConfig): void {
  logger.transports = configToTransports(options);
}

/**
 * Base log function
 *
 * Note: it's highly recommended to use the helper functions
 * logDebug, logVerbose, logInfo, logWarn, and logError
 *
 * @param log
 */
function log(log: SgLog): void {
  // Clean up
  log.data = log.data ?? {};

  const { logLevel, message, ...otherFields } = log;

  logger.log(logLevel, message, otherFields);
}

function logDebug(message: string, customData?: any, tags?: string[]): void {
  log({
    logLevel: 'debug',
    message: message,
    tags: tags,
    data: customData ?? {},
  });
}

function logVerbose(message: string, customData?: any, tags?: string[]): void {
  log({
    logLevel: 'verbose',
    message: message,
    tags: tags,
    data: customData,
  });
}

function logInfo(message: string, customData?: any, tags?: string[]): void {
  log({
    logLevel: 'info',
    message: message,
    tags: tags,
    data: customData,
  });
}

function logWarn(message: string, customData?: any, tags?: string[]): void {
  log({
    logLevel: 'warn',
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
    logLevel: 'error',
    message: message,
    tags: tags,
    data: customData,
    errorMessage: error?.message,
    errorStack: error?.stack,
  });
}

export {
  LoggerConfig,
  coloredConsoleTransport,
  simpleConsoleTransport,
  configureLogger,
  logDebug,
  logVerbose,
  logInfo,
  logWarn,
  logError,
};
