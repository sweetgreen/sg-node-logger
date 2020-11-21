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
  - Useful when logs are not needed when running unit tests

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
const { logDebug } = require('@sweetgreen/sg-node-logger');

// ES6
import { logDebug } from '@sweetgreen/sg-node-logger';

logDebug('Debug message');
```

### Helper Functions (recommended)

#### Simple Case

```js
import {
  logDebug,
  logVerbose,
  logInfo,
  logWarn,
  logError
} from '@sweetgreen/sg-node-logger';

logDebug('Debug message');
logVerbose('Verbose message');
logInfo('Info message');
logWarn('Warn message');
logError('Error message');
```

#### Logging Custom Data

```js
import { logDebug } from '@sweetgreen/sg-node-logger';

// WARNING: it's your responsibility to remove all PII
const customData = {
  a: 'some string',
  b: 12345,
}

logDebug('Debug message', customData);
```

#### Tagging (highly recommended)

```js
import { logDebug } from '@sweetgreen/sg-node-logger';

const tags: string[] = ['main-feature-name', 'sub-feature-name'];

logDebug('Debug message', undefined, tags);
```

#### Error

```js
import { logError } from '@sweetgreen/sg-node-logger';

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
import { logDebug } from '@sweetgreen/sg-node-logger';

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
          type: Transport.SimpleConsole,
          minimumLogLevel: LogLevel.Info,
        },
      ],
    },
    {
      nodeEnvName: Environment.PreProduction,
      transports: [
        {
          type: Transport.SimpleConsole,
          minimumLogLevel: LogLevel.Info,
        },
      ],
    },
  ],
}
```

- Note that "production" and "preproduction" NODE_ENV values will be used if using the default configuration. Ensure to adjust your NODE_ENV environment values accordingly.

#### Pre-Defined Configurations

- Pre-defined configurations will be added over time to make it dead simple to use and to keep the code clean.

```js
import { configureLogger, aPredefinedConfig } from '@sweetgreen/sg-node-logger';

// Keep the configuration close to the application's entry point
configureLogger(aPredefinedConfig);

logDebug('Debug message');
```

#### Custom Configuration

```js
import {
  LoggerOptions,
  Transport,
  LogLevel,
  configureLogger,
  logDebug,
} from '@sweetgreen/sg-node-logger';

const myConfigs: LoggerOptions = {
  {
    environments: [
      {
        nodeEnvName: 'production',
        transports: [
          {
            type: Transport.SimpleConsole,
            minimumLogLevel: LogLevel.Verbose, // Optional: defaults to Info
          },
          {
            type: Transport.AwsCloudWatch, // Coming soon
            minimumLogLevel: LogLevel.Warn, // Optional: defaults to Info
          },
        ],
      },
      {
        nodeEnvName: 'development',
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
configureLogger(myConfigs);

logDebug('Debug message');
```

- `nodeEnvName` can be any value that your application uses in its lifecycle ('prod' vs. 'production', 'dev' vs. 'develop', etc)

## Transports

### Simple

```
# Sample logs
info: testing info {"data":{},"timestamp":"2020-11-21T06:24:06.048Z"}
warn: testing warn {"data":{},"timestamp":"2020-11-21T06:24:06.048Z"}
error: testing error {"data":{},"timestamp":"2020-11-21T06:24:06.048Z"}
```

### Colored

```
# Sample logs
[SGLOG]  2020-11-20 10:26:22.866  info : testing info
[SGLOG]  2020-11-20 10:26:22.872  warn : testing warn 
[SGLOG]  2020-11-20 10:26:22.872  error : testing error
```

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
