[![fastify-fusion](site/logo.svg)](https://fastify-fusion.org)

# fastify-fusion
[![codecov](https://codecov.io/gh/jaredwray/fastify-fusion/graph/badge.svg?token=ieUorXA15v)](https://codecov.io/gh/jaredwray/fastify-fusion)
[![tests](https://github.com/jaredwray/fastify-fusion/actions/workflows/tests.yaml/badge.svg)](https://github.com/jaredwray/fastify-fusion/actions/workflows/tests.yaml)
[![npm](https://img.shields.io/npm/v/fastify-fusion)](https://www.npmjs.com/package/fastify-fusion)
[![npm](https://img.shields.io/npm/dm/fastify-fusion)](https://www.npmjs.com/package/fastify-fusion)
[![license](https://img.shields.io/github/license/jaredwray/cacheable)](https://github.com/jaredwray/fastify-fusion/blob/main/LICENSE)

Fastify API framework with best practices fused together to make it easy to build and maintain your API.

# Features
- **Batteries Included** - All the best practices for building a Fastify API are included out of the box.
- **CORS** - CORS enabled by default with sensible defaults using `fastify-cors`.
- **Helmet** - Security headers set using `fastify-helmet`.
- **Logging** - Pino Configured using Pino Pretty to make it easy to read.
- **Static Paths**: Default `./public` static path and easy to add / configure your own.
- **TypeScript** - Fully typed with TypeScript, including all plugins and options.
- **Regularly updated**: Updated regularly to keep up with the latest Fastify and TypeScript features.

# Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Fuse Options](#fuse-options)
- [Static Paths](#static-paths)
- [Logging](#logging)
- [Helmet](#helmet)
- [How to Contribute](#how-to-contribute)
- [Licensing and Copyright](#licensing-and-copyright)

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

await fuse(app);
```

Want to just get your app up and running? You can use the `fastify()` function to create a new Fastify app with the default options.

```typescript
import { fastify } from 'fastify-fusion';

const app = await fastify();
```

You can also pass in the `FuseOptions` to customize your fastify instance.

# Fuse Options

You can customize the behavior of `fastify-fusion` by passing in options to the `fuse` function or when creating a new Fastify app with `fastify()`.

```typescript
import { fuse, FuseOptions } from 'fastify-fusion';
import Fastify from 'fastify';
const app = Fastify();
const options: FuseOptions = {
  cors: {
    origin: '*', // Allow all origins
  },
  helmet: {
    contentSecurityPolicy: false, // Disable CSP for simplicity
  },
  static: {
    path: '/static/', // Serve static files from /public
    dir: './static', // Path to the static files
  },
};
await fuse(app, options);
```

Here is the `FuseOptions` interface with all the available options:

```typescript
export type FuseOptions = {
	static?: boolean | StaticOptions;
	log?: boolean | LoggerOptions;
	helmet?: boolean | FastifyHelmetOptions;
};
```

By default, all the options are set to `true`, which means that all of the default settings will be applied. You can learn about the default settings in each features's documentation below.

# Static Paths

By default `fastify-fusion` serves static files from the `./public` directory. You can change this by passing in a `StaticOptions` object to the `fuse` function. The default configuration serves static files from the `/public` path. Here is an example of how to customize the static file serving:

```typescript
const defaultStaticPath = [
    {
        dir: path.resolve('./public'),
        path: '/',
    },
];
```

```typescript
import { fuse, FuseOptions } from 'fastify-fusion';
import Fastify from 'fastify';
const app = Fastify();
const options: FuseOptions = {
  static: {
    dir: './static/', // Serve static files from /static
    path: '/static', // Path to the static files
  },
};
await fuse(app, options);
```

# Logging

By default, `fastify-fusion` uses Pino for logging and configures it with sensible defaults. You can customize the logging behavior by passing in a `LoggerOptions` object to the `fuse` function. The default logging configuration uses `pino-pretty` and here are the default options:

```typescript
export const defaultLoggingOptions = {
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			translateTime: true,
			ignore: 'pid,hostname',
			singleLine: true,
		},
	},
};
```

Here is an example of how to customize the logging options:

```typescript
import { fuse, FuseOptions } from 'fastify-fusion';
import Fastify from 'fastify';
const app = Fastify();
const options: FuseOptions = {
  log: {
    level: 'info', // Set the log level
    prettyPrint: true, // Enable pretty print for development
  },
};
await fuse(app, options);
```

# Helmet
`fastify-fusion` uses `fastify-helmet` to set security headers by default. You can customize the behavior of `fastify-helmet` by passing in a `FastifyHelmetOptions` object to the `fuse` function. The default configuration sets the following headers:

```typescript
export const defaultFastifyHelmetOptions: FastifyHelmetOptions = {
	// Turn off CSP (mostly for HTML) to avoid overhead
	contentSecurityPolicy: false,

	// Remove the X-Power-By header
	hidePoweredBy: true,

	// Prevent your API from being framed
	frameguard: {action: 'deny'},

	// Disable DNS prefetching
	dnsPrefetchControl: {allow: false},

	// Enable HSTS for one year on HTTPS endpoints
	hsts: {
		maxAge: 31_536_000, // 365 days in seconds
		includeSubDomains: true,
		preload: true,
	},

	// Block sniffing of MIME types
	noSniff: true,

	// Basic XSS protections
	xssFilter: true,

	// Don't send Referer at all
	referrerPolicy: {policy: 'no-referrer'},

	// Tighten cross-origin resource loading
	crossOriginResourcePolicy: {policy: 'same-origin'},

	// You generally don't need the embedder/policy on an API
	crossOriginEmbedderPolicy: false,

	// Leave CSP nonces off
	// eslint-disable-next-line @typescript-eslint/naming-convention
	enableCSPNonces: false,
};
```

You can customize the security headers by passing in a `FastifyHelmetOptions` object to the `fuse` function. Here is an example of how to customize the helmet options:

```typescript
import { fuse, FuseOptions } from 'fastify-fusion';
import Fastify from 'fastify';
const app = Fastify();
const options: FuseOptions = {
  helmet: {
    contentSecurityPolicy: false, // Disable CSP for simplicity
    crossOriginEmbedderPolicy: false, // Disable COEP for simplicity
  },
};
await fuse(app, options);
```

# How to Contribute

If you want to contribute to this project, please read the [Contributing Guide](./CONTRIBUTING.md) for more information on how to get started.

# Licensing and Copyright

This project is licensed under the [MIT License](./LICENSE). Copyright (c) Jared Wray.