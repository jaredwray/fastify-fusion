import path from 'node:path';
import {type FastifyInstance} from 'fastify';
import {type StaticOptions, registerStatic} from './static.js';
import {registerLog, defaultLoggingOptions, type LoggerOptions} from './log.js';
import {defaultFastifyHelmetOptions, type FastifyHelmetOptions, registerHelmet} from './helmet.js';
import {defaultFastifyRateLimitOptions, type FastifyRateLimitOptions, registerRateLimit} from './rate-limit.js';
import {defaultOpenApiOptions, registerOpenApi, type OpenApiOptions} from './open-api.js';

export type FuseOptions = {
	static?: boolean | StaticOptions;
	log?: boolean | LoggerOptions;
	helmet?: boolean | FastifyHelmetOptions;
	rateLimit?: boolean | FastifyRateLimitOptions;
	openApi?: boolean | OpenApiOptions;
};

export async function fuse(fastify: FastifyInstance, options?: FuseOptions): Promise<void> {
	// If no options are provided, use the default options
	options ??= {
		static: true,
		log: true,
		helmet: true,
		rateLimit: true,
		openApi: true,
	};

	// Register the logger
	if (options.log !== undefined && typeof options.log !== 'boolean') {
		await registerLog(fastify, options.log);
	} else if (options.log !== false) {
		// Register the default logger if they are not specified
		await registerLog(fastify, defaultLoggingOptions);
	}

	// Register the static paths
	if (options.static !== undefined && typeof options.static !== 'boolean') {
		await registerStatic(fastify, options.static);
	} else if (options.static !== false) {
		// Register the default 'public' directory if they are not specified
		const defaultStaticPath = [
			{
				dir: path.resolve('./public'),
				path: '/',
			},
		];
		await registerStatic(fastify, defaultStaticPath);
	}

	// Register the helmet security headers
	if (options.helmet !== undefined && typeof options.helmet !== 'boolean') {
		await registerHelmet(fastify, options.helmet);
	} else if (options.helmet !== false) {
		// Register the default helmet options if they are not specified
		await registerHelmet(fastify, defaultFastifyHelmetOptions);
	}

	// Register the rate limit
	if (options.rateLimit !== undefined && typeof options.rateLimit !== 'boolean') {
		await registerRateLimit(fastify, options.rateLimit);
	} else if (options.rateLimit !== false) {
		// Register the default rate limit options if they are not specified
		await registerRateLimit(fastify, defaultFastifyRateLimitOptions);
	}

	// Register the OpenAPI documentation
	if (options.openApi !== undefined && typeof options.openApi !== 'boolean') {
		await registerOpenApi(fastify, options.openApi);
	} else if (options.openApi !== false) {
		// Register the default OpenAPI options if they are not specified
		await registerOpenApi(fastify, defaultOpenApiOptions);
	}
}
