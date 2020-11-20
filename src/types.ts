export type Option<T> = T | undefined;

/**
 * Mainly used for default configurations
 */
export enum Environment {
  Production = 'production',
  PreProduction = 'preproduction',
}

/**
 * List of log levels
 *
 * Note that the enum list is fed into the logger (Winston). The logger uses
 * the ordering (int values) to determine at which level to start logging.
 * For example, if using Info as the minimum log level, every level above and
 * including Info will be logged. In other words, Info, Warn and Error logs
 * are enabled.
 *
 * NOTE: do not change the enum value unless the side effects are clearly
 * understood
 */
export enum LogLevel {
  Error = 0,
  Warn = 1,
  Info = 2,
  Verbose = 3,
  Debug = 4,
}

/**
 * This list goes hand in hand with {LogLevel}.
 * NOTE: changing the values have consequences! Make sure you know the
 * side effects before making changes.
 */
export const WinstonLogLevels = {
  Error: 0,
  Warn: 1,
  Info: 2,
  Verbose: 3,
  Debug: 4,
};

/**
 * List of transports
 */
export enum Transport {
  SimpleConsole,
  ColoredConsole,
}

export interface LoggerConfig {
  environments: EnvironmentConfig[];
}

export interface EnvironmentConfig {
  nodeEnvName: string;
  transportConfigs: TransportConfig[];
}

export interface TransportConfig {
  transportType: Transport;
  minimumLogLevel?: LogLevel;
}

/**
 * Log interface
 */
export interface SgLog {
  logLevel: string;
  message: string;
  sessionId?: string;
  requestId?: string;
  tags?: string[];
  hostname?: string;
  ipaddress?: string;
  version?: string;
  appName?: string;
  deployment?: string;
  /** Any custom data - WARNING: DO NOT LOG PII */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  /** NOTE: automatically filled by Winston */
  timestamp?: string;
  errorMessage?: string;
  errorStack?: string;
  os?: string;
  osVersion?: string;
  osBuildNumber?: string;
}
