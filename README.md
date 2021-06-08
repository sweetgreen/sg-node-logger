[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# sg Node Logger

## Future Plans (stack ranked)

- Add unit tests
- Data Dog transport
- Explore morgan integration
- Automatically assign SessionId and RequestId if available
- Handling of PII/sensitive information
  - Option 1: Wrap this with fast-redact (https://github.com/davidmarkclements/fast-redact) such that clients can pass keys that should be redacted
  - Option 2: PII tagging system (field/object) to automatically remove sensitive information from logs
- Config files that can be used by consumers to automatically configure logger to fit needs (i.e. using this logger in a raspberry pi env vs in ECS)
- File/env-var based logger on/off switch
  - Useful when logs are not needed (ie, unit tests)
- AWS CloudWatch - auto manage rate-limiting (this may go away with the introduction of the DataDog transport)

## Vision

- Speed up the development of applications without worrying about the logging frameworks
- Make it dead simple to use
- Use uniform log objects
  - No more guessing what the logs look like
  - Simplifies log querying across the board (in Data Dog, for example)

## Warning

> We cannot stress this enough. Do NOT log PII or any sensitive information.
> For any questions, contact our friendly cyber-security team.

## Getting Started

### Log Shape

```ts
{
  // Provided by application/user
  // - changes from log to log
  logLevel: LogLevel;
  message: string;
  tags?: string[];
  data?: any;
  errorMessage?: string;
  errorStack?: string;

  // Dynamic Metadata
  // - susceptible to change from log to log
  utcTimestamp?: string;
  sessionId?: string;
  correlationId?: string;
  requestId?: string;

  // Static Metadata
  // - values are set once during startup
  // - does not change from log to log
  appName?: string;
  appVersion?: string;
  environment?: string;
  hostname?: string;
  ipaddress?: string;
  os?: string;
  osVersion?: string;
  osBuildNumber?: string;
}
```

### Prerequisites

- Add github package registry to your project

```sh
# Because this package is hosted in @sweetgreen's github repository, you will need to add our registry to your project:

# In your project root:
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN\nregistry=https://npm.pkg.github.com/sweetgreen" >> .npmrc

# See https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token to create a personal access token.

# WARNING: make sure the .npmrc file is .gitignored!
```

### Installation

1. Add to your node project

```sh
# yarn
yarn add @sweetgreen/sg-node-logger

# npm
npm i @sweetgreen/sg-node-logger
```

### Environment Variables

The following environment variables are used by the package:

- `NODE_ENV`
  - ONLY when specifying a custom configuration
  - Assigns logger transports based on the environment value

`NODE_ENV` is ignored when using the library out of the box. Meaning, when a custom configuration is not passed to the initializer (`initLogger()`).

## Usage

```javascript
// CommonJS
const { logDebug, initLogger } = require('@sweetgreen/sg-node-logger');

// ES6
import { logDebug, initLogger } from '@sweetgreen/sg-node-logger';

// Initialize logger once and only once
// NOTE: Subsequent usage of `logDebug` does NOT need to be paired with `initLogger()`.
// NOTE: This simple out of the box usage style does not require the presence of `NODE_ENV`.

initLogger('application-name');

// Log away
logDebug('Debug message');
```

#### 🚨 NOTE: When initializing in an application using `dd-tace,` the `dd-trace` initialization should come prior to `initLogger`. See [here](https://sweetgreen.atlassian.net/wiki/spaces/DevOps/pages/1929413719/Advanced+Datadog+Features+Helpful+Tips#Missing-Endpoints-/-URL-Routes) for more information.




### Helper Functions (recommended)

#### Simple Case

```js
import {
  initLogger,
  logDebug,
  logVerbose,
  logInfo,
  logWarn,
  logError,
} from '@sweetgreen/sg-node-logger';

initLogger('application-name');

logDebug('Debug message');
logVerbose('Verbose message');
logInfo('Info message');
logWarn('Warn message');
logError('Error message');
```

#### Logging Custom Data

```js
import { initLogger, logDebug } from '@sweetgreen/sg-node-logger';

initLogger('application-name');

// WARNING: it's your responsibility to remove all PII
const customData = {
  a: 'some string',
  b: 12345,
};

logDebug('Debug message', customData);
```

#### Tagging (highly recommended)

```js
import { initLogger, logDebug } from '@sweetgreen/sg-node-logger';

initLogger('application-name');

const tags: string[] = ['main-feature-name', 'sub-feature-name'];

logDebug('Debug message', undefined, tags);
```

#### Error

```js
import { initLogger, logError } from '@sweetgreen/sg-node-logger';

initLogger('application-name');

try {
  // CODE ...
} catch (error) {
  logError('Error message', error);
}
```

### Configuration

#### Default Configuration

This code is using the default configuration under the hood

```js
import { initLogger, logDebug } from '@sweetgreen/sg-node-logger';

initLogger('application-name');

logDebug('Debug message');
```

Details of the default configuration (for the latest configuration checkout the function `rawJSONConsoleConfig()` in the `configs.ts` file):

```js
{
  environments: [
    {
      nodeEnvName: Environment.All,
      transports: {
        rawJSONConsole: [
          {
            minimumLogLevel: LogLevel.Info,
          } as RawJSONConsoleTransportConfig,
        ],
      },
    },
  ],
}
```

- This configuration is used across all environments (`Environment.All`)

#### Pre-Defined Configurations

- Pre-defined configurations will be added over time to make it as simple as possible to use and to keep the code clean and clear from file based configuration.

```js
import {
  initLogger,
  aPredefinedConfig,
  logDebug,
} from '@sweetgreen/sg-node-logger';

// Keep the configuration close to the application's entry point
initLogger('application-name', aPredefinedConfig);

logDebug('Debug message');
```

#### Custom Configuration

```js
import {
  LoggerOptions,
  SimpleConsoleTransportConfig,
  ColorizedConsoleTransportConfig,
  AwsCloudWatchTransportConfig,
  Transport,
  LogLevel,
  initLogger,
  logDebug,
} from '@sweetgreen/sg-node-logger';

const loggerOptions: LoggerOptions = {
  {
    environments: [
      {
        nodeEnvironmentName: 'production',
        transports: {
          colorizedConsole: [
            {
              minimumLogLevel: LogLevel.Verbose,
            } as ColorizedConsoleTransportConfig,
          ],
          awsCloudWatch: [
            {
              minimumLogLevel: LogLevel.Warn, // Optional: defaults to Info
            } as AwsCloudWatchTransportConfig,
          ],
        },
      },
      {
        nodeEnvironmentName: 'development',
        transports: {
          simpleConsole: [
            {
              minimumLogLevel: LogLevel.Error, // Optional: defaults to Info
            } as SimpleConsoleTransportConfig,
          ],
        },
      },
    ],
  };
}

// Keep the initializer close to the application's entry point
initLogger('application-name', loggerOptions);

logDebug('Debug message');
```

- `nodeEnvironmentName` can be any value that your application uses in its lifecycle ('prod', 'production', 'dev', 'develop', etc) when using the custom configuration.

## Transports

### Available Transports

```js
import {
  LoggerOptions,
  SimpleConsoleTransportConfig,
  ColorizedConsoleTransportConfig,
  AwsCloudwatchTransportConfig,
} from '@sweetgreen/sg-node-logger';

const loggerOptions: LoggerOptions = {
  {
    environments: [
      {
        nodeEnvironmentName: 'production',
        transports: {
          simpleConsole: [
            {
              // configuration goes here
            } as SimpleConsoleTransportConfig,
          ],
          colorizedConsole: [
            {
              // configuration goes here
            } as ColorizedConsoleTransportConfig,
          ],
          awsCloudWatch: [
            {
              // configuration goes here
            } as AwsCloudwatchTransportConfig,
            {
              // same transports can be repeated
            } as AwsCloudwatchTransportConfig,
          ],
          rawJSONConsole: [
            {
              // configuration goes here
            } as RawJSONConsoleTransportConfig,
          ]
        },
      },
    ],
  };
}
```

### SimpleConsole

```
# Sample logs
info: testing info {"data":{},"timestamp":"2020-11-21T06:24:06.048Z"}
warn: testing warn {"data":{},"timestamp":"2020-11-21T06:24:06.048Z"}
error: testing error {"data":{},"timestamp":"2020-11-21T06:24:06.048Z"}
```

### ColorizedConsole

![ColorizedConsole](/assets/pretty-transport-1.png)

### RawJSONConsole

```
{"environment":"production","appName":"sg-node-logger","tags":["startup"],"level":"warn","message":"Verify PII is removed from all logs! Application security is everyone's responsibility.","timestamp":"2021-01-21T17:41:28.365Z"}
{"environment":"production","appName":"sg-node-logger","data":{"a":"jfkkjflsd","b":137843},"level":"info","message":"testing info","timestamp":"2021-01-21T17:41:28.367Z"}
{"environment":"production","appName":"sg-node-logger","tags":["tag1","tag2"],"level":"warn","message":"testing warn","timestamp":"2021-01-21T17:41:28.367Z"}
{"environment":"production","appName":"sg-node-logger","level":"error","message":"testing error","timestamp":"2021-01-21T17:41:28.367Z"}
```

### AwsCloudwatch

- Credentials
  - There are two options:
    - Option 1: read from `~/.aws/credentials`. The logger automatically picks up the credentials from this file. It is the default behavior when using the simple config.
    - Option 2: access key and secret key can be passed to the transport, though manual configuration is required.
- Best Practices
  - `uploadRateInMilliseconds` (must be between 200 and 60000 or 0.2 secs and 60 seconds)
    - Rate Limiting
      - CW Log groups have quotas and rate limits. Make sure it's well understood when deciding this value
        - Currently, CW log streams are limited to 5 requests per second -> 200 milliseconds.
        - [PutLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutLogEvents.html)
        - [CloudWatch Service Quotas](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_limits.html)
    - Values - recommendations
      - Default value is 10000 - 10 seconds
      - Sample usage, use the value 1000 if there will be 5 instances running your application. Which translates to 5 requests per second.
      - Another strategy is to use multiple log streams to avoid rate-limiting.
  - `retentionInDays` (must be between 15 days and 180 days)
    - AWS accepted values = [1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827, 3653]
    - Module minimum is 1
    - Module maximum is 180
    - Default is `150` days

Example full custom configuration - typical,

```ts
import {
  AwsCloudwatchTransportConfig,
  LoggerOptions,
  LogLevel,
  initLogger,
  logDebug,
} from '@sweetgreen/sg-node-logger';

const loggerOptions: LoggerOptions = {
  {
    environments: [
      {
        nodeEnvironmentName: 'production',
        transports: {
          awsCloudWatch: [{
            {
              // Optional: defaults to Info
              minimumLogLevel: LogLevel.Info,

              awsRegion: 'us-east-1',

              logGroupName: '/HelloWorldService/Production',

              // Optional: both access and secret must be passed, otherwise
              // it throws an error.
              // Make sure both are empty/undefined to use the '~/.aws/credentials' file.
              accessKeyId: '<aws-access-key-id>',
              secretAccessKey: '<aws-secret-access-key>',

              // Optional: defaults to 10000 (10 secs)
              uploadRateInMilliseconds: 10000,

              // Optional: defaults to 180 days
              retentionInDays: 30,
            } as AwsCloudwatchTransportConfig,
          },
        ],
      },
    ],
  };
}

// Keep the configuration close to the application's entry point (index.ts)
initLogger('application-name', loggerOptions);

logDebug('Debug message');
```

Example using `~/.aws/credentials` + using default values,

```ts
import {
  AwsCloudwatchTransportConfig,
  LoggerOptions,
  initLogger,
  logDebug,
} from '@sweetgreen/sg-node-logger';

const loggerOptions: LoggerOptions = {
  {
    environments: [
      {
        nodeEnvironmentName: 'production',
        transports: {
          awsCloudWatch: [
            {
              awsRegion: 'us-east-1',
              logGroupName: '/HelloWorldService/Production',
            } as AwsCloudwatchTransportConfig,
          ],
        },
      },
    ],
  };
}

// Keep the configuration close to the application's entry point (index.ts)
initLogger('application-name', loggerOptions);

logDebug('Debug message');
```

With this option, the following defaults will be used:

- `minimumLogLevel` will be default `LogLevel.Info`
- `accessKeyId` and `secretAccessKey` are empty, therefore `~/.aws/credentials` will be used
- `uploadRateInMilliseconds` will use the default `10000` ms - 10 seconds
- `retentionInDays` will use the default `180` days

## Contributing

This repo uses commitizen and is set up in such a way that when you commit, you'll be prompted with a commit wizard. Your inputs will determine what version CI will bump this package to 🍻
