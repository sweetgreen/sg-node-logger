"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawJSONConsoleTransport = exports.awsCloudWatchTransport = exports.colorizedConsoleTransport = exports.simpleConsoleTransport = void 0;
var winston_1 = __importDefault(require("winston"));
var aws_sdk_1 = __importDefault(require("aws-sdk"));
var winston_cloudwatch_1 = __importDefault(require("winston-cloudwatch"));
var types_1 = require("./types");
var errors_1 = require("./errors");
var client_cloudwatch_logs_1 = require("@aws-sdk/client-cloudwatch-logs");
/**
 * Basic console stdout
 *
 * @example info: testing info {"data":{},"timestamp":"2020-11-21T06:24:06.048Z"}
 *
 * @param minimumLogLevel all logs with this severity and above
 * will be enabled; default is Info
 */
function simpleConsoleTransport(minimumLogLevel) {
    if (minimumLogLevel === void 0) { minimumLogLevel = types_1.LogLevel.Info; }
    return new winston_1.default.transports.Console({
        level: types_1.LogLevel[minimumLogLevel].toLowerCase(),
        format: winston_1.default.format.simple(),
    });
}
exports.simpleConsoleTransport = simpleConsoleTransport;
/**
 * Colored console stdout
 *
 * @example [SGLOG]  2020-11-20 10:26:22.866  info : testing info
 *
 * @param minimumLogLevel all logs with this severity and above
 * will be enabled; default is Info
 */
function colorizedConsoleTransport(minimumLogLevel) {
    if (minimumLogLevel === void 0) { minimumLogLevel = types_1.LogLevel.Info; }
    var formatting = winston_1.default.format.combine(winston_1.default.format.colorize({
        all: true,
    }), winston_1.default.format.label({
        label: '[SGLOG]',
    }), winston_1.default.format.timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS',
    }), winston_1.default.format.printf(function (info) {
        return "".concat(info.label, "  ").concat(info.timestamp, "  ").concat(info.level, " : ").concat(info.message, " ").concat(info.data || info.tags || info.errorMessage || info.errorStack
            ? JSON.stringify({
                data: info.data,
                tags: info.tags,
                errorMessage: info.errorMessage,
                errorStack: info.errorStack,
            })
            : '');
    }));
    return new winston_1.default.transports.Console({
        level: types_1.LogLevel[minimumLogLevel].toLowerCase(),
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), formatting),
    });
}
exports.colorizedConsoleTransport = colorizedConsoleTransport;
/**
 * Sends logs to AWS CloudWatch
 *
 * @param options
 *
 * @throws InvalidParameterError
 */
function awsCloudWatchTransport(_a) {
    var _b = _a.minimumLogLevel, minimumLogLevel = _b === void 0 ? types_1.LogLevel.Info : _b, awsRegion = _a.awsRegion, logGroupName = _a.logGroupName, applicationName = _a.applicationName, accessKeyId = _a.accessKeyId, secretAccessKey = _a.secretAccessKey, _c = _a.uploadRateInMilliseconds, uploadRateInMilliseconds = _c === void 0 ? 10000 : _c, _d = _a.retentionInDays, retentionInDays = _d === void 0 ? 180 : _d;
    var transportName = 'AwsCloudWatch';
    var maxUploadRateInMs = 60000;
    var minUploadRateInMis = 200;
    var maxRetentionInDays = 180;
    var minRetentionInDays = 1;
    var cloudWatchLogsClientConfig;
    if (!awsRegion) {
        throw new errors_1.ParameterLoggerError("[".concat(transportName, "] 'AwsRegion' is a required input."));
    }
    if (accessKeyId && !secretAccessKey) {
        throw new errors_1.ParameterLoggerError("[".concat(transportName, "] AWS 'AccessKeyId' is present, however, \n      'SecretAccessKey' is missing. Ensure both inputs are supplied \n      when custom configuring the logger."));
    }
    else if (!accessKeyId && secretAccessKey) {
        throw new errors_1.ParameterLoggerError("[".concat(transportName, "] AWS 'SecretAccessKey' is present, however, \n      'AccessKeyId' is missing. Ensure both inputs are supplied when \n      custom configuring the logger."));
    }
    else if (accessKeyId && secretAccessKey) {
        aws_sdk_1.default.config.update({
            region: awsRegion,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });
        cloudWatchLogsClientConfig = {
            region: awsRegion,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        };
    }
    else {
        aws_sdk_1.default.config.update({
            region: awsRegion,
        });
        cloudWatchLogsClientConfig = {
            region: awsRegion,
        };
    }
    if (uploadRateInMilliseconds < minUploadRateInMis ||
        uploadRateInMilliseconds > maxUploadRateInMs) {
        throw new errors_1.ParameterLoggerError("[".concat(transportName, "] The 'UploadRateInMilliseconds' (").concat(uploadRateInMilliseconds, ") \n      parameter must be between ").concat(minUploadRateInMis, " ms and ").concat(maxUploadRateInMs, " ms."));
    }
    if (retentionInDays < minRetentionInDays ||
        retentionInDays > maxRetentionInDays) {
        throw new errors_1.ParameterLoggerError("[".concat(transportName, "] The 'RetentionInDays' (").concat(retentionInDays, ") parameter \n      must be between ").concat(minRetentionInDays, " days and ").concat(maxRetentionInDays, " days."));
    }
    return new winston_cloudwatch_1.default({
        cloudWatchLogs: new client_cloudwatch_logs_1.CloudWatchLogs(cloudWatchLogsClientConfig),
        level: types_1.LogLevel[minimumLogLevel].toLowerCase(),
        logGroupName: logGroupName,
        // NOTE: setting 'logStreamName' to a function will split logs across multiple streams.
        // A rotation can be created using multiple criteria (i.e. date, hour, etc.)
        logStreamName: function () {
            var _a = new Date().toISOString().split('T'), logDate = _a[0], logTime = _a[1];
            return "".concat(applicationName, ".").concat(logDate);
        },
        jsonMessage: true,
        uploadRate: uploadRateInMilliseconds,
        retentionInDays: retentionInDays,
    });
}
exports.awsCloudWatchTransport = awsCloudWatchTransport;
/**
 * Raw JSON console stdout
 *
 * @example info: testing info {"environment":"development","appName":"sg-node-logger","data":{"a":"jfkkjflsd","b":137843},"level":"info","message":"testing info","timestamp":"2020-12-11T19:57:17.120Z"}
 *
 * @param minimumLogLevel all logs with this severity and above
 * will be enabled; default is Info
 */
function rawJSONConsoleTransport(minimumLogLevel) {
    if (minimumLogLevel === void 0) { minimumLogLevel = types_1.LogLevel.Info; }
    return new winston_1.default.transports.Console({
        level: types_1.LogLevel[minimumLogLevel].toLowerCase(),
    });
}
exports.rawJSONConsoleTransport = rawJSONConsoleTransport;
//# sourceMappingURL=transports.js.map