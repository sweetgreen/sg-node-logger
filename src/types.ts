export type Option<T> = T | undefined;

/**
 * Default environments
 */
export enum Environment {
  Production = 'production',
  PreProduction = 'preproduction',
}

/**
 * List of log levels
 *
 * The log levels are used to determine at which level to start logging.
 * For example, if using Info as the minimum log level, every level above and
 * including Info will be logged. In other words, Info, Warn and Error logs
 * are enabled.
 *
 * NOTE: this enum goes hand in hand with winston log levels found here
 * https://www.npmjs.com/package/winston#logging-levels. If changing, make
 * sure the values (string and int) match.
 * Do not change the enum unless the side effects are clearly understood.
 */
export enum LogLevel {
  Error = 0,
  Warn = 1,
  Info = 2,
  Verbose = 4,
  Debug = 5,
}

/**
 * List of transports
 */
export enum Transport {
  SimpleConsole,
  PrettyConsole,
}

export interface LoggerOptions {
  environments: EnvironmentConfig[];
}

export interface EnvironmentConfig {
  nodeEnvName: string;
  transports: TransportConfig[];
}

export interface TransportConfig {
  type: Transport;
  minimumLogLevel?: LogLevel;
}

/**
 * User defined log entry
 */
export interface LogEntry {
  logLevel: LogLevel;
  message: string;
  tags?: string[];
  /** Any custom data - WARNING: DO NOT LOG PII */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  errorMessage?: string;
  errorStack?: string;
}

/**
 * Log metadata that is set dynamically for each log
 */
export interface DynamicLogMetadata {
  utcTimestamp?: string;
  sessionId?: string;
  correlationId?: string;
}

/**
 * Log metadata that is set once on application start up
 */
export interface StaticLogMetadata {
  appName?: string;
  appVersion?: string;
  environment?: string;
  hostname?: string;
  ipaddress?: string;
  os?: string;
  osVersion?: string;
  osBuildNumber?: string;
}

export interface SgLog
  extends LogEntry,
    DynamicLogMetadata,
    StaticLogMetadata {}
