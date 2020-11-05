<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm

```sh
npm install npm@latest -g
```

### Installation

1. Add to your node project

```sh
yarn add @sweetgreen/sg-node-logger
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

<!-- ROADMAP -->
