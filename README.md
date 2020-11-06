[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

<!-- GETTING STARTED -->

## Getting Started

To use this logger follow the instructions below:

### Prerequisites

- Add github package registry to your project

```sh
# Because this package is hosted in @sweetgreen's github repository, you will need to add our registry to your project:

# In your project root:
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_PERSONAL_ACCESS_TOKEN\nregistry=https://npm.pkg.github.com/sweetgreen" >> .npmrc

# See https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token to create a personal access token.

# NOTE: DO NOT COMMIT YOUR GITHUB_PERSONAL_ACCESS_TOKEN!
```

### Installation

1. Add to your node project

```sh
# yarn
yarn add @sweetgreen/sg-node-logger

# npm
npm i @sweetgreen/sg-node-logger
```

<!-- USAGE EXAMPLES -->

## Usage

```javascript
// CommonJS
const { sgLogger } = require('@sweetgreen/sg-node-logger');

// ES6
import { sgLogger } from '@sweetgreen/sg-node-logger';

sgLogger.info('salads');
```

_This logger is merely a wrapper around Winston, please refer to their [Documentation](https://github.com/winstonjs/winston)_

## Contributing

This repo uses commitizen and is set up in such a way that when you commit, you'll be prompted with a commit wizard. Your inputs will determine what version CI will bump this package to 🍻
