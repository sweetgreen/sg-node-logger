import winston from 'winston';

import {
  Option,
  EnvironmentConfig,
  StaticLogMetadata,
  AwsCloudWatchTransportConfig,
} from './types';
import {
  awsCloudWatchTransport,
  colorizedConsoleTransport,
  simpleConsoleTransport,
  rawJSONConsoleTransport,
} from './transports';
import { colorizedConsoleConfig } from './configs';
import {
  ConfigurationLoggerError,
  EnvironmentVariableLoggerError,
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
  const transports = getTransports(appName, colorizedConsoleConfig());

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
    throw new EnvironmentVariableLoggerError('NODE_ENV variable must be set');
  }

  // Find the config for the current environment
  const environments = environmentConfigs.filter(
    (env) => env.nodeEnvironmentName.trim().toLowerCase() === nodeEnv
  );

  if (environments.length === 0) {
    throw new ConfigurationLoggerError(
      `There is no configuration for the '${nodeEnv}' environment.`
    );
  }

  if (environments.length > 1) {
    throw new ConfigurationLoggerError(
      `There are multiple configurations for the '${nodeEnv}' environment.`
    );
  }

  const environmentTransports = environments[0].transports;

  // At least one transport must be configured
  if (
    (!environmentTransports.rawJSONConsole ||
      environmentTransports.rawJSONConsole.length === 0) &&
    (!environmentTransports.simpleConsole ||
      environmentTransports.simpleConsole.length === 0) &&
    (!environmentTransports.colorizedConsole ||
      environmentTransports.colorizedConsole.length === 0) &&
    (!environmentTransports.awsCloudWatch ||
      environmentTransports.awsCloudWatch.length === 0)
  ) {
    throw new ConfigurationLoggerError(
      `At least one transport must be configured for the '${nodeEnv}' environment.`
    );
  }

  const transports: winston.transport[] = [];

  // TODO: DRY - create single function to handle all transports
  // OPTION: use classes/OOP - each class should know how to handle itself

  // Simple Console Transport
  if (
    environmentTransports.simpleConsole &&
    environmentTransports.simpleConsole.length > 0
  ) {
    environmentTransports.simpleConsole.forEach((transport) => {
      transports.push(simpleConsoleTransport(transport.minimumLogLevel));
    });
  }

  // Colorized Console Transport
  if (
    environmentTransports.colorizedConsole &&
    environmentTransports.colorizedConsole.length > 0
  ) {
    environmentTransports.colorizedConsole.forEach((transport) => {
      transports.push(colorizedConsoleTransport(transport.minimumLogLevel));
    });
  }

  // AWS CloudWatch
  if (
    environmentTransports.awsCloudWatch &&
    environmentTransports.awsCloudWatch.length > 0
  ) {
    environmentTransports.awsCloudWatch.forEach((transport) => {
      transports.push(
        awsCloudWatchTransport({
          minimumLogLevel: transport.minimumLogLevel,
          awsRegion: transport.awsRegion,
          logGroupName: transport.logGroupName,
          applicationName: appName,
          accessKeyId: transport.accessKeyId,
          secretAccessKey: transport.secretAccessKey,
          uploadRateInMilliseconds: transport.uploadRateInMilliseconds,
          retentionInDays: transport.retentionInDays,
        } as AwsCloudWatchTransportConfig)
      );
    });
  }

  if (
    environmentTransports.rawJSONConsole &&
    environmentTransports.rawJSONConsole.length > 0
  ) {
    environmentTransports.rawJSONConsole.forEach((transport) => {
      transports.push(rawJSONConsoleTransport(transport.minimumLogLevel));
    });
  }

  return transports;
}
