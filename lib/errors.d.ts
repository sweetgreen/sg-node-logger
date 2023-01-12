export declare class LoggerError extends Error {
    constructor(message?: string);
}
export declare class TransportLoggerError extends LoggerError {
    constructor(message?: string);
}
export declare class ConfigurationLoggerError extends LoggerError {
    constructor(message?: string);
}
export declare class EnvironmentVariableLoggerError extends LoggerError {
    constructor(message?: string);
}
export declare class ParameterLoggerError extends LoggerError {
    constructor(message?: string);
}
