"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.logWarn = exports.logInfo = exports.logVerbose = exports.logDebug = exports.rawJSONConsoleConfig = exports.simpleConsoleConfig = exports.colorizedConsoleConfig = exports.LogLevel = exports.initLogger = void 0;
// NOTE: Special case to allow 'any' in the helper functions ONLY.
// We want to support the passing of any shape for custom data.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
var dotenv_1 = __importDefault(require("dotenv"));
var types_1 = require("./types");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return types_1.LogLevel; } });
var helpers_1 = require("./helpers");
var configs_1 = require("./configs");
Object.defineProperty(exports, "simpleConsoleConfig", { enumerable: true, get: function () { return configs_1.simpleConsoleConfig; } });
Object.defineProperty(exports, "colorizedConsoleConfig", { enumerable: true, get: function () { return configs_1.colorizedConsoleConfig; } });
Object.defineProperty(exports, "rawJSONConsoleConfig", { enumerable: true, get: function () { return configs_1.rawJSONConsoleConfig; } });
var errors_1 = require("./errors");
// Init dotenv
dotenv_1.default.config();
var logger;
/**
 * Initializes the logger. Uses default configuration if none is passed.
 *
 * @param options logger options/config
 */
function initLogger(appName, options) {
    var transports = (options === null || options === void 0 ? void 0 : options.environments)
        ? (0, helpers_1.getTransports)(appName, options.environments, true)
        : (0, helpers_1.getTransports)(appName, (0, configs_1.rawJSONConsoleConfig)());
    logger = (0, helpers_1.newLogger)(appName, transports);
}
exports.initLogger = initLogger;
/**
 * Base log function
 *
 * Note: it's highly recommended to use the helper functions:
 * logDebug, logVerbose, logInfo, logWarn, and logError
 *
 * @param log log object
 */
function log(log) {
    // TODO: set DynamicLogMetadata
    // const metadata: DynamicLogMetadata = {
    //   utcTimestamp: new Date().toISOString(),
    //   sessionId: 'uuid',
    //   correlationId: 'uuid',
    // };
    var logLevel = log.logLevel, message = log.message, otherFields = __rest(log, ["logLevel", "message"]);
    var level = types_1.LogLevel[logLevel].toLowerCase();
    if (!logger) {
        throw new errors_1.LoggerError("Ensure the logger has been initialized by calling initLogger() at the app's entry point.");
    }
    logger.log(level, message, otherFields);
}
function logDebug(message, customData, tags) {
    log({
        logLevel: types_1.LogLevel.Debug,
        message: message,
        tags: tags,
        data: customData,
    });
}
exports.logDebug = logDebug;
function logVerbose(message, customData, tags) {
    log({
        logLevel: types_1.LogLevel.Verbose,
        message: message,
        tags: tags,
        data: customData,
    });
}
exports.logVerbose = logVerbose;
function logInfo(message, customData, tags) {
    log({
        logLevel: types_1.LogLevel.Info,
        message: message,
        tags: tags,
        data: customData,
    });
}
exports.logInfo = logInfo;
function logWarn(message, customData, tags) {
    log({
        logLevel: types_1.LogLevel.Warn,
        message: message,
        tags: tags,
        data: customData,
    });
}
exports.logWarn = logWarn;
function logError(message, error, customData, tags) {
    log({
        logLevel: types_1.LogLevel.Error,
        message: message,
        tags: tags,
        data: customData,
        errorMessage: error === null || error === void 0 ? void 0 : error.message,
        errorStack: error === null || error === void 0 ? void 0 : error.stack,
    });
}
exports.logError = logError;
//# sourceMappingURL=index.js.map