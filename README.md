[![fastify-fusion](./site/logo.svg)](https://fastify-fusion.org)

# fastify-fusion
Fastify API framework with best practices fused together to make it easy to build and maintain your API.

# Features
- **Fast**: Built on top of [Fastify](https://www.fastify.io/), the fastest web framework for Node.js.
- **TypeScript**: Written in TypeScript, with type definitions included.
- **Batteries included**: Preconfigured and easy to use with [Fastify](https://www.fastify.io/) plugins.
- **Logging** - Pino Configured using Pino Pretty to make it easy to read.
- **Static Paths**: Default `./public` static path and easy to add / configure your own.
- **Regularly updated**: Updated regularly to keep up with the latest Fastify and TypeScript features.

# Installation
```bash
npm install fastify-fusion fastify
```

# Usage

If you already have a Fastify app, you can use `fuse` to add the default options and plugins to your app.

```typescript
import { fuse, FuseOptions } from 'fastify-fusion';
import Fastify from 'fastify';

const app = Fastify();

// Fuse the app. It will use the default options if none are provided. If you want to use your own options, pass them in as the second argument.

fuse(app);
```

Want to just get your app up and running? You can use the `fastify()` function to create a new Fastify app with the default options.

```typescript
import { fastify } from 'fastify-fusion';

const app = fastify();
```

You can also pass in the `FuseOptions` to customize your fastify instance.
