import winston from 'winston';
import AWS from 'aws-sdk';
import { ConsoleTransportInstance } from 'winston/lib/winston/transports';
import WinstonCloudWatch from 'winston-cloudwatch';

import { LogLevel } from './types';
import { ParameterLoggerError } from './errors';
import {
  CloudWatchLogs,
  CloudWatchLogsClient,
  CloudWatchLogsClientConfig,
} from '@aws-sdk/client-cloudwatch-logs';

/**
 * Basic console stdout
 *
 * @example info: testing info {"data":{},"timestamp":"2020-11-21T06:24:06.048Z"}
 *
 * @param minimumLogLevel all logs with this severity and above
 * will be enabled; default is Info
 */
export function simpleConsoleTransport(
  minimumLogLevel: LogLevel = LogLevel.Info
): ConsoleTransportInstance {
  return new winston.transports.Console({
    level: LogLevel[minimumLogLevel].toLowerCase(),
    format: winston.format.simple(),
  });
}

/**
 * Colored console stdout
 *
 * @example [SGLOG]  2020-11-20 10:26:22.866  info : testing info
 *
 * @param minimumLogLevel all logs with this severity and above
 * will be enabled; default is Info
 */
export function colorizedConsoleTransport(
  minimumLogLevel: LogLevel = LogLevel.Info
): ConsoleTransportInstance {
  const formatting = winston.format.combine(
    winston.format.colorize({
      all: true,
    }),
    winston.format.label({
      label: '[SGLOG]',
    }),
    winston.format.timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS',
    }),
    winston.format.printf(
      (info) =>
        `${info.label}  ${info.timestamp}  ${info.level} : ${info.message} ${
          info.data || info.tags || info.errorMessage || info.errorStack
            ? JSON.stringify({
                data: info.data,
                tags: info.tags,
                errorMessage: info.errorMessage,
                errorStack: info.errorStack,
              })
            : ''
        }`
    )
  );

  return new winston.transports.Console({
    level: LogLevel[minimumLogLevel].toLowerCase(),
    format: winston.format.combine(winston.format.colorize(), formatting),
  });
}

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
export function awsCloudWatchTransport({
  minimumLogLevel = LogLevel.Info,
  awsRegion,
  logGroupName,
  applicationName,
  accessKeyId,
  secretAccessKey,
  uploadRateInMilliseconds = 10000,
  retentionInDays = 180,
}: AwsCloudWatchTransportOptions): WinstonCloudWatch {
  const transportName = 'AwsCloudWatch';
  const maxUploadRateInMs = 60000;
  const minUploadRateInMis = 200;
  const maxRetentionInDays = 180;
  const minRetentionInDays = 1;
  let cloudWatchLogsClientConfig;
  const helloTest = 1;

  if (!awsRegion) {
    throw new ParameterLoggerError(
      `[${transportName}] 'AwsRegion' is a required input.`
    );
  }

  if (accessKeyId && !secretAccessKey) {
    throw new ParameterLoggerError(
      `[${transportName}] AWS 'AccessKeyId' is present, however, 
      'SecretAccessKey' is missing. Ensure both inputs are supplied 
      when custom configuring the logger.`
    );
  } else if (!accessKeyId && secretAccessKey) {
    throw new ParameterLoggerError(
      `[${transportName}] AWS 'SecretAccessKey' is present, however, 
      'AccessKeyId' is missing. Ensure both inputs are supplied when 
      custom configuring the logger.`
    );
  } else if (accessKeyId && secretAccessKey) {
    AWS.config.update({
      region: awsRegion,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
    cloudWatchLogsClientConfig = {
      region: awsRegion,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    };
  } else {
    AWS.config.update({
      region: awsRegion,
    });
    cloudWatchLogsClientConfig = {
      region: awsRegion,
    };
  }

  if (
    uploadRateInMilliseconds < minUploadRateInMis ||
    uploadRateInMilliseconds > maxUploadRateInMs
  ) {
    throw new ParameterLoggerError(
      `[${transportName}] The 'UploadRateInMilliseconds' (${uploadRateInMilliseconds}) 
      parameter must be between ${minUploadRateInMis} ms and ${maxUploadRateInMs} ms.`
    );
  }

  if (
    retentionInDays < minRetentionInDays ||
    retentionInDays > maxRetentionInDays
  ) {
    throw new ParameterLoggerError(
      `[${transportName}] The 'RetentionInDays' (${retentionInDays}) parameter 
      must be between ${minRetentionInDays} days and ${maxRetentionInDays} days.`
    );
  }

  return new WinstonCloudWatch({
    cloudWatchLogs: new CloudWatchLogs(cloudWatchLogsClientConfig),
    level: LogLevel[minimumLogLevel].toLowerCase(),
    logGroupName: logGroupName,
    // NOTE: setting 'logStreamName' to a function will split logs across multiple streams.
    // A rotation can be created using multiple criteria (i.e. date, hour, etc.)
    logStreamName: () => {
      const [logDate, logTime] = new Date().toISOString().split('T');
      return `${applicationName}.${logDate}`;
    },
    jsonMessage: true,
    uploadRate: uploadRateInMilliseconds,
    retentionInDays: retentionInDays,
  });
}

/**
 * Raw JSON console stdout
 *
 * @example info: testing info {"environment":"development","appName":"sg-node-logger","data":{"a":"jfkkjflsd","b":137843},"level":"info","message":"testing info","timestamp":"2020-12-11T19:57:17.120Z"}
 *
 * @param minimumLogLevel all logs with this severity and above
 * will be enabled; default is Info
 */
export function rawJSONConsoleTransport(
  minimumLogLevel: LogLevel = LogLevel.Info
): ConsoleTransportInstance {
  return new winston.transports.Console({
    level: LogLevel[minimumLogLevel].toLowerCase(),
  });
}
