[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# sg Node Logger

## Future Plans (stack ranked)

- Add unit tests
- Send logs to cloudwatch
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

> **We cannot stress this enough. Do NOT log PII or any sensitive information.**
>
> **For any questions, contact our friendly cyber-security team.**

## Getting Started

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
  - Assigns logger transports based on the environment value

## Usage

```javascript
// CommonJS
const { logDebug, initLogger } = require('@sweetgreen/sg-node-logger');

// ES6
import { logDebug, initLogger } from '@sweetgreen/sg-node-logger';

// Initialize logger
initLogger();

// Log away
logDebug('Debug message');
```

### Helper Functions (recommended)

#### Simple Case

```js
import {
  initLogger,
  logDebug,
  logVerbose,
  logInfo,
  logWarn,
  logError
} from '@sweetgreen/sg-node-logger';

initLogger();

logDebug('Debug message');
logVerbose('Verbose message');
logInfo('Info message');
logWarn('Warn message');
logError('Error message');
```

#### Logging Custom Data

```js
import { initLogger, logDebug } from '@sweetgreen/sg-node-logger';

initLogger();

// WARNING: it's your responsibility to remove all PII
const customData = {
  a: 'some string',
  b: 12345,
}

logDebug('Debug message', customData);
```

#### Tagging (highly recommended)

```js
import { initLogger, logDebug } from '@sweetgreen/sg-node-logger';

initLogger();

const tags: string[] = ['main-feature-name', 'sub-feature-name'];

logDebug('Debug message', undefined, tags);
```

#### Error

```js
import { initLogger, logError } from '@sweetgreen/sg-node-logger';

initLogger();

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

initLogger();

logDebug('Debug message');
```

Details of the default configuration (for the latest configuration checkout the function `defaultConfig()` in the `configs.ts` file):
```js
{
  environments: [
    {
      nodeEnvName: Environment.Production,
      transports: [
        {
          type: Transport.PrettyConsole,
          minimumLogLevel: LogLevel.Info,
        },
      ],
    },
    {
      nodeEnvName: Environment.PreProduction,
      transports: [
        {
          type: Transport.PrettyConsole,
          minimumLogLevel: LogLevel.Info,
        },
      ],
    },
  ],
}
```

- Note that "production" and "preproduction" NODE_ENV values will be used if using the default configuration. Ensure to adjust your NODE_ENV environment values accordingly.

#### Pre-Defined Configurations (future plan)

- Pre-defined configurations will be added over time to make it as simple as possible to use and to keep the code clean and clear from file based configuration.

```js
import { initLogger, aPredefinedConfig, logDebug } from '@sweetgreen/sg-node-logger';

// Keep the configuration close to the application's entry point
initLogger(aPredefinedConfig);

logDebug('Debug message');
```

#### Custom Configuration

```js
import {
  LoggerOptions,
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
        transports: [
          {
            type: Transport.PrettyConsole,
            minimumLogLevel: LogLevel.Verbose, // Optional: defaults to Info
          },
          {
            type: Transport.AwsCloudWatch, // Coming soon
            minimumLogLevel: LogLevel.Warn, // Optional: defaults to Info
          },
        ],
      },
      {
        nodeEnvironmentName: 'development',
        transports: [
          {
            type: Transport.SimpleConsole,
            minimumLogLevel: LogLevel.Error, // Optional: defaults to Info
          },
        ],
      },
    ],
  };
}

// Keep the configuration close to the application's entry point
initLogger(loggerOptions);

logDebug('Debug message');
```

- `nodeEnvironmentName` can be any value that your application uses in its lifecycle ('prod' vs. 'production', 'dev' vs. 'develop', etc) when using the custom configuration (not available in default or pre-defined configurations).

## Transports

### SimpleConsole

```
# Sample logs
info: testing info {"data":{},"timestamp":"2020-11-21T06:24:06.048Z"}
warn: testing warn {"data":{},"timestamp":"2020-11-21T06:24:06.048Z"}
error: testing error {"data":{},"timestamp":"2020-11-21T06:24:06.048Z"}
```

### PrettyConsole

```
# Sample logs
[SGLOG]  2020-11-20 10:26:22.866  info : testing info
[SGLOG]  2020-11-20 10:26:22.872  warn : testing warn 
[SGLOG]  2020-11-20 10:26:22.872  error : testing error
```

### AwsCloudwatch

Example custom configuration,
```ts
import {
  AwsCloudwatchTransportConfig,
  LoggerOptions,
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
        transports: [
          {
            type: Transport.AwsCloudwatch,
            
            // Optional: defaults to Info
            minimumLogLevel: LogLevel.Info,
            
            awsRegion: 'us-east-1',

            logGroupName: '/HelloWorldService/Production',

            // Optional: auto assigned from package.json if empty
            applicationName: 'hello-world-service',

            // Optional: used when accessKeyId and secretAccessKey are
            // available. Otherwise, uses the '~/.aws/credentials' file.
            accessKeyId: '<aws-access-key-id>',
            secretAccessKey: '<aws-secret-access-key>',

            // Optional: defaults to 5000 (5 secs)
            uploadRateInMilliseconds: 10000,

            // Optional: defaults to 180 days
            retentionInDays: 180,
          } as AwsCloudwatchTransportConfig,
        ],
      },
      {
        nodeEnvironmentName: 'development',
        transports: [
          {
            type: Transport.PrettyConsole,
            minimumLogLevel: LogLevel.Error, // Optional: defaults to Info
          },
        ],
      },
    ],
  };
}

// Keep the configuration close to the application's entry point (index.ts)
initLogger(loggerOptions);

logDebug('Debug message');
```

- Credentials. There are two options:
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
      - Default value is `5000` - 5 seconds
      - In general, we don't need sub-second updates. However, the number of instances expected to run multiplied by 200 should give you a good value to use for applications that need the immediate feedback. For example,
        - Use `200`, if there will be a single instance running your application/service.
        - Use `1000`, if there will be 5 instances running your application.
        - Another strategy is to use multiple log streams to avoid rate-limiting.
    - There are other limitations/quotas. Ensure to go over them especially for highly trafficked services.
  - `retentionInDays` (must be between 15 days and 180 days)
    - Default is `150` days

## Development

### Environemnt Variables

The following environment variables are used in the project:
- NODE_ENV

Use the `.env` file for testing different environments
```sh
# .env file

# Reference the Environment enum for correct values
NODE_ENV=production|development|etc
```

## Contributing

This repo uses commitizen and is set up in such a way that when you commit, you'll be prompted with a commit wizard. Your inputs will determine what version CI will bump this package to 🍻
