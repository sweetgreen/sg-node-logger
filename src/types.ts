export type Option<T> = T | undefined;

//
// ENUM
//

/**
 * Default environments and meant to be used internally in this module.
 */
export enum Environment {
  All = 'all',
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

//
// CONFIG
//

export interface LoggerOptions {
  environments?: EnvironmentConfig[];
}

export interface EnvironmentConfig {
  nodeEnvironmentName: string;
  transports: TransportConfig;
}

export interface TransportConfig {
  simpleConsole?: SimpleConsoleTransportConfig[];
  colorizedConsole?: ColorizedConsoleTransportConfig[];
  awsCloudWatch?: AwsCloudWatchTransportConfig[];
  rawJSONConsole?: RawJSONConsoleTransportConfig[];
}

export interface TransportConfigBase {
  minimumLogLevel?: LogLevel;
}

export interface SimpleConsoleTransportConfig extends TransportConfigBase {}

export interface ColorizedConsoleTransportConfig extends TransportConfigBase {}

export interface AwsCloudWatchTransportConfig extends TransportConfigBase {
  awsRegion: string;
  logGroupName: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  uploadRateInMilliseconds?: number;
  retentionInDays?: number;
}

export interface RawJSONConsoleTransportConfig extends TransportConfigBase {}

//
// LOG
//

/**
 * User defined log entry`
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
  requestId?: string;
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

/** Shape of the full log */
export interface SgLog
  extends LogEntry,
    DynamicLogMetadata,
    StaticLogMetadata {}
