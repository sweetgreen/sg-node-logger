import { ConsoleTransportInstance } from 'winston/lib/winston/transports';
import WinstonCloudWatch from 'winston-cloudwatch';
import { LogLevel } from './types';
/**
 * Basic console stdout
 *
 * @example info: testing info {"data":{},"timestamp":"2020-11-21T06:24:06.048Z"}
 *
 * @param minimumLogLevel all logs with this severity and above
 * will be enabled; default is Info
 */
export declare function simpleConsoleTransport(minimumLogLevel?: LogLevel): ConsoleTransportInstance;
/**
 * Colored console stdout
 *
 * @example [SGLOG]  2020-11-20 10:26:22.866  info : testing info
 *
 * @param minimumLogLevel all logs with this severity and above
 * will be enabled; default is Info
 */
export declare function colorizedConsoleTransport(minimumLogLevel?: LogLevel): ConsoleTransportInstance;
export interface AwsCloudWatchTransportOptions {
    minimumLogLevel?: LogLevel;
    awsRegion: string;
    logGroupName: string;
    applicationName?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    uploadRateInMilliseconds?: number;
    retentionInDays?: number;
}
/**
 * Sends logs to AWS CloudWatch
 *
 * @param options
 *
 * @throws InvalidParameterError
 */
export declare function awsCloudWatchTransport({ minimumLogLevel, awsRegion, logGroupName, applicationName, accessKeyId, secretAccessKey, uploadRateInMilliseconds, retentionInDays, }: AwsCloudWatchTransportOptions): WinstonCloudWatch;
/**
 * Raw JSON console stdout
 *
 * @example info: testing info {"environment":"development","appName":"sg-node-logger","data":{"a":"jfkkjflsd","b":137843},"level":"info","message":"testing info","timestamp":"2020-12-11T19:57:17.120Z"}
 *
 * @param minimumLogLevel all logs with this severity and above
 * will be enabled; default is Info
 */
export declare function rawJSONConsoleTransport(minimumLogLevel?: LogLevel): ConsoleTransportInstance;
