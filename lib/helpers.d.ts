import winston from 'winston';
import { EnvironmentConfig } from './types';
export declare function newLogger(appName: string, transports: winston.transport[]): winston.Logger;
/**
 * Converts transport configurations to concrete transports.
 *
 * @param appName the application name
 * @param environmentConfigs the options to convert
 * @param enableValidation validates NODE_ENV and configurations - ENABLE when using custom config
 */
export declare function getTransports(appName: string, environmentConfigs: EnvironmentConfig[], enableValidation?: boolean): winston.transport[];
