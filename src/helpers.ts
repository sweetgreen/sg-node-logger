import winston from 'winston';

import {
  Option,
  Transport,
  EnvironmentConfig,
  StaticLogMetadata,
  AwsCloudwatchTransportConfig,
} from './types';
import {
  awsCloudWatchTransport,
  prettyConsoleTransport,
  simpleConsoleTransport,
} from './transports';
import { prettyConsoleConfig } from './configs';
import {
  UnknownTransportError,
  MissingConfigurationError,
  MissingEnvironmentVariableError,
} from './errors';

export function newLogger(
  appName: string,
  transports: winston.transport[]
): winston.Logger {
  const staticLogMetadata: StaticLogMetadata = {
    environment: process.env.NODE_ENV,
    appName: appName,
  };

  return winston.createLogger({
    silent: false,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: staticLogMetadata,
    transports: transports,
  });
}

/**
 * New instance of the logger using default transports
 */
export function defaultLogger(appName: string): winston.Logger {
  const transports = getTransports(appName, prettyConsoleConfig());

  return newLogger(appName, transports);
}

/**
 * Converts transport configurations to concrete transports
 *
 * @param environmentConfigs the options to convert
 */
export function getTransports(
  appName: string,
  environmentConfigs: EnvironmentConfig[]
): winston.transport[] {
  const nodeEnv: Option<string> = process.env.NODE_ENV?.trim().toLowerCase();

  if (!nodeEnv) {
    throw new MissingEnvironmentVariableError('NODE_ENV variable must be set');
  }

  // Find the config for the current environment
  const environments = environmentConfigs.filter(
    (env) => env.nodeEnvironmentName.trim().toLowerCase() === nodeEnv
  );

  if (environments.length === 0) {
    throw new MissingConfigurationError(
      `There is no configuration for the '${nodeEnv}' environment.`
    );
  }

  const currentEnvironmentConfig = environments[0];

  if (currentEnvironmentConfig.transports.length === 0) {
    throw new MissingConfigurationError(
      `'transports' are missing for the '${nodeEnv}' environment.`
    );
  }

  const transports: winston.transport[] = [];

  // Get transports
  currentEnvironmentConfig.transports.forEach((config) => {
    switch (config.type) {
      case Transport.SimpleConsole:
        transports.push(simpleConsoleTransport(config.minimumLogLevel));
        break;
      case Transport.PrettyConsole:
        transports.push(prettyConsoleTransport(config.minimumLogLevel));
        break;
      case Transport.AwsCloudWatch:
        const cloudwatchConfig = config as AwsCloudwatchTransportConfig;
        transports.push(
          awsCloudWatchTransport({
            minimumLogLevel: cloudwatchConfig.minimumLogLevel,
            awsRegion: cloudwatchConfig.awsRegion,
            logGroupName: cloudwatchConfig.logGroupName,
            applicationName: appName,
            accessKeyId: cloudwatchConfig.accessKeyId,
            secretAccessKey: cloudwatchConfig.secretAccessKey,
            uploadRateInMilliseconds: cloudwatchConfig.uploadRateInMilliseconds,
            retentionInDays: cloudwatchConfig.retentionInDays,
          })
        );
        break;
      default:
        throw new UnknownTransportError(
          `Transport type '${config.type}' has not been mapped yet`
        );
    }
  });

  return transports;
}
