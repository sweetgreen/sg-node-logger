export class SgNodeLoggerError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class UnknownTransportError extends SgNodeLoggerError {
  constructor(message?: string) {
    super(message);
  }
}

export class MissingConfigurationError extends SgNodeLoggerError {
  constructor(message?: string) {
    super(message);
  }
}

export class MissingNodeEnvironmentError extends SgNodeLoggerError {
  constructor(message?: string) {
    super(message);
  }
}
