import { AwsCloudWatchTransportConfig, SimpleConsoleTransportConfig, ColorizedConsoleTransportConfig, RawJSONConsoleTransportConfig, LoggerOptions, LogLevel } from './types';
import { simpleConsoleConfig, colorizedConsoleConfig, rawJSONConsoleConfig } from './configs';
/**
 * Initializes the logger. Uses default configuration if none is passed.
 *
 * @param options logger options/config
 */
declare function initLogger(appName: string, options?: LoggerOptions): void;
declare function logDebug(message: string, customData?: any, tags?: string[]): void;
declare function logVerbose(message: string, customData?: any, tags?: string[]): void;
declare function logInfo(message: string, customData?: any, tags?: string[]): void;
declare function logWarn(message: string, customData?: any, tags?: string[]): void;
declare function logError(message: string, error?: Error, customData?: any, tags?: string[]): void;
export { initLogger, LogLevel, LoggerOptions, SimpleConsoleTransportConfig, ColorizedConsoleTransportConfig, AwsCloudWatchTransportConfig, RawJSONConsoleTransportConfig, colorizedConsoleConfig, simpleConsoleConfig, rawJSONConsoleConfig, logDebug, logVerbose, logInfo, logWarn, logError, };
