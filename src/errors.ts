export class LoggerError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class TransportLoggerError extends LoggerError {
  constructor(message?: string) {
    super(message);
  }
}

export class ConfigurationLoggerError extends LoggerError {
  constructor(message?: string) {
    super(message);
  }
}

export class EnvironmentVariableLoggerError extends LoggerError {
  constructor(message?: string) {
    super(message);
  }
}

export class ParameterLoggerError extends LoggerError {
  constructor(message?: string) {
    super(message);
  }
}
