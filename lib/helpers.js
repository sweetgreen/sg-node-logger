"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransports = exports.newLogger = void 0;
var winston_1 = __importDefault(require("winston"));
var types_1 = require("./types");
var transports_1 = require("./transports");
var errors_1 = require("./errors");
function newLogger(appName, transports) {
    var staticLogMetadata = {
        environment: process.env.NODE_ENV,
        appName: appName,
    };
    return winston_1.default.createLogger({
        silent: false,
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
        defaultMeta: staticLogMetadata,
        transports: transports,
    });
}
exports.newLogger = newLogger;
/**
 * Converts transport configurations to concrete transports.
 *
 * @param appName the application name
 * @param environmentConfigs the options to convert
 * @param enableValidation validates NODE_ENV and configurations - ENABLE when using custom config
 */
function getTransports(appName, environmentConfigs, enableValidation) {
    var _a;
    if (enableValidation === void 0) { enableValidation = false; }
    var environmentConfigList;
    if (enableValidation) {
        // Custom Config
        var nodeEnv_1 = (_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
        validate(environmentConfigs, nodeEnv_1);
        environmentConfigList = environmentConfigs.filter(function (env) { return env.nodeEnvironmentName.trim().toLowerCase() === nodeEnv_1; });
    }
    else {
        // Out of the box config
        var nodeEnv_2 = types_1.Environment.All;
        environmentConfigList = environmentConfigs.filter(function (env) { return env.nodeEnvironmentName.trim().toLowerCase() === nodeEnv_2; });
    }
    var environmentTransports = environmentConfigList[0].transports;
    var transports = [];
    // TODO: DRY - create single function to handle all transports
    // OPTION: use classes/OOP - each class should know how to handle itself
    // Simple Console Transport
    if (environmentTransports.simpleConsole &&
        environmentTransports.simpleConsole.length > 0) {
        environmentTransports.simpleConsole.forEach(function (transport) {
            transports.push((0, transports_1.simpleConsoleTransport)(transport.minimumLogLevel));
        });
    }
    // Colorized Console Transport
    if (environmentTransports.colorizedConsole &&
        environmentTransports.colorizedConsole.length > 0) {
        environmentTransports.colorizedConsole.forEach(function (transport) {
            transports.push((0, transports_1.colorizedConsoleTransport)(transport.minimumLogLevel));
        });
    }
    // AWS CloudWatch
    if (environmentTransports.awsCloudWatch &&
        environmentTransports.awsCloudWatch.length > 0) {
        environmentTransports.awsCloudWatch.forEach(function (transport) {
            transports.push((0, transports_1.awsCloudWatchTransport)({
                minimumLogLevel: transport.minimumLogLevel,
                awsRegion: transport.awsRegion,
                logGroupName: transport.logGroupName,
                applicationName: appName,
                accessKeyId: transport.accessKeyId,
                secretAccessKey: transport.secretAccessKey,
                uploadRateInMilliseconds: transport.uploadRateInMilliseconds,
                retentionInDays: transport.retentionInDays,
            }));
        });
    }
    if (environmentTransports.rawJSONConsole &&
        environmentTransports.rawJSONConsole.length > 0) {
        environmentTransports.rawJSONConsole.forEach(function (transport) {
            transports.push((0, transports_1.rawJSONConsoleTransport)(transport.minimumLogLevel));
        });
    }
    return transports;
}
exports.getTransports = getTransports;
/**
 * Validates the NODE_ENV and configuration ONLY when custom configuration is present.
 *
 * @param environmentConfigs the logger configuration
 * @param environmentName the current environment name
 */
function validate(environmentConfigs, environmentName) {
    if (!environmentName) {
        throw new errors_1.EnvironmentVariableLoggerError('NODE_ENV variable must be set');
    }
    // Find the config for the current environment
    var environments = environmentConfigs.filter(function (env) { return env.nodeEnvironmentName.trim().toLowerCase() === environmentName; });
    if (environments.length === 0) {
        throw new errors_1.ConfigurationLoggerError("There is no configuration for the '".concat(environmentName, "' environment."));
    }
    if (environments.length > 1) {
        throw new errors_1.ConfigurationLoggerError("There are multiple configurations for the '".concat(environmentName, "' environment."));
    }
    var environmentTransports = environments[0].transports;
    // At least one transport must be configured
    if ((!environmentTransports.rawJSONConsole ||
        environmentTransports.rawJSONConsole.length === 0) &&
        (!environmentTransports.simpleConsole ||
            environmentTransports.simpleConsole.length === 0) &&
        (!environmentTransports.colorizedConsole ||
            environmentTransports.colorizedConsole.length === 0) &&
        (!environmentTransports.awsCloudWatch ||
            environmentTransports.awsCloudWatch.length === 0)) {
        throw new errors_1.ConfigurationLoggerError("At least one transport must be configured for the '".concat(environmentName, "' environment."));
    }
}
//# sourceMappingURL=helpers.js.map