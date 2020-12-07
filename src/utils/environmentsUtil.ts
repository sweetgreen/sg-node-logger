import { EnvironmentVariableLoggerError } from '../errors';
import { Option } from '../types';

/**
 * Returns value of NODE_ENV
 *
 * @return name of the environment - trimmed and lower-cased
 */
function environmentName(): Option<string> {
  const name: Option<string> = process.env.NODE_ENV;

  if (name === undefined) {
    return undefined;
  }

  return name.trim().toLowerCase();
}

/**
 * Returns value of SGLOGGER_ENABLED
 *
 * Uses the following rules:
 * - Returns true, if environment variable is not set (undefined) or missing altogether.
 * - Returns true, if value is the string equivalent of 'true'.
 * - Returns false, if value is the string equivalent of 'false'.
 * - Throws an exception if environment variable is set, but value isn't either 'true' or 'false'.
 *
 * @returns true, if logger is enabled; otherwise false, if logger is disabled
 * @throws EnvironmentVariableLoggerError
 */
function loggerEnabled(): boolean {
  const value: Option<string> = process.env.SGLOGGER_ENABLED;

  if (value === undefined) {
    return true;
  }

  const cleanValue = value.trim().toLowerCase();

  if (cleanValue === 'false') {
    return false;
  } else if (cleanValue === 'true') {
    return true;
  } else {
    throw new EnvironmentVariableLoggerError(
      `Unknown value '${cleanValue}' for SGLOGGER_ENABLED.`
    );
  }
}

export { environmentName, loggerEnabled };
