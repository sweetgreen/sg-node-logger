"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterLoggerError = exports.EnvironmentVariableLoggerError = exports.ConfigurationLoggerError = exports.TransportLoggerError = exports.LoggerError = void 0;
var LoggerError = /** @class */ (function (_super) {
    __extends(LoggerError, _super);
    function LoggerError(message) {
        return _super.call(this, message) || this;
    }
    return LoggerError;
}(Error));
exports.LoggerError = LoggerError;
var TransportLoggerError = /** @class */ (function (_super) {
    __extends(TransportLoggerError, _super);
    function TransportLoggerError(message) {
        return _super.call(this, message) || this;
    }
    return TransportLoggerError;
}(LoggerError));
exports.TransportLoggerError = TransportLoggerError;
var ConfigurationLoggerError = /** @class */ (function (_super) {
    __extends(ConfigurationLoggerError, _super);
    function ConfigurationLoggerError(message) {
        return _super.call(this, message) || this;
    }
    return ConfigurationLoggerError;
}(LoggerError));
exports.ConfigurationLoggerError = ConfigurationLoggerError;
var EnvironmentVariableLoggerError = /** @class */ (function (_super) {
    __extends(EnvironmentVariableLoggerError, _super);
    function EnvironmentVariableLoggerError(message) {
        return _super.call(this, message) || this;
    }
    return EnvironmentVariableLoggerError;
}(LoggerError));
exports.EnvironmentVariableLoggerError = EnvironmentVariableLoggerError;
var ParameterLoggerError = /** @class */ (function (_super) {
    __extends(ParameterLoggerError, _super);
    function ParameterLoggerError(message) {
        return _super.call(this, message) || this;
    }
    return ParameterLoggerError;
}(LoggerError));
exports.ParameterLoggerError = ParameterLoggerError;
//# sourceMappingURL=errors.js.map