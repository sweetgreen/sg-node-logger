"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = exports.Environment = void 0;
//
// ENUM
//
/**
 * Default environments and meant to be used internally in this module.
 */
var Environment;
(function (Environment) {
    Environment["All"] = "all";
})(Environment = exports.Environment || (exports.Environment = {}));
/**
 * List of log levels
 *
 * The log levels are used to determine at which level to start logging.
 * For example, if using Info as the minimum log level, every level above and
 * including Info will be logged. In other words, Info, Warn and Error logs
 * are enabled.
 *
 * NOTE: this enum goes hand in hand with winston log levels found here
 * https://www.npmjs.com/package/winston#logging-levels. If changing, make
 * sure the values (string and int) match.
 * Do not change the enum unless the side effects are clearly understood.
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Error"] = 0] = "Error";
    LogLevel[LogLevel["Warn"] = 1] = "Warn";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Verbose"] = 4] = "Verbose";
    LogLevel[LogLevel["Debug"] = 5] = "Debug";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
//# sourceMappingURL=types.js.map