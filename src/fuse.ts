/* eslint-disable @typescript-eslint/no-unsafe-argument */
import path from "node:path";
import type { FastifyInstance } from "fastify";
import {
	defaultFastifyCorsOptions,
	type FastifyCorsOptions,
	fuseCors,
} from "./cors.js";
import {
	defaultFastifyHelmetOptions,
	type FastifyHelmetOptions,
	fuseHelmet,
} from "./helmet.js";
import { defaultLoggingOptions, fuseLog, type LoggerOptions } from "./log.js";
import { fuseOpenApi, type OpenApiOptions } from "./open-api.js";
import {
	defaultFastifyRateLimitOptions,
	type FastifyRateLimitOptions,
	fuseRateLimit,
} from "./rate-limit.js";
import { fuseStatic, type StaticOptions } from "./static.js";

export type FuseOptions = {
	static?: boolean | StaticOptions;
	log?: boolean | LoggerOptions;
	helmet?: boolean | FastifyHelmetOptions;
	rateLimit?: boolean | FastifyRateLimitOptions;
	cors?: boolean | FastifyCorsOptions;
	openApi?: boolean | OpenApiOptions;
};

export async function fuse(
	fastify: FastifyInstance,
	options?: FuseOptions,
): Promise<void> {
	// If no options are provided, use the default options
	options ??= {
		static: true,
		log: true,
		helmet: true,
		rateLimit: true,
		cors: true,
		openApi: true,
	};

	// Register the logger
	if (options.log !== undefined && typeof options.log !== "boolean") {
		await fuseLog(fastify, options.log);
	} else if (options.log !== false) {
		// Register the default logger if they are not specified
		await fuseLog(fastify, defaultLoggingOptions);
	}

	// Register the static paths
	if (options.static !== undefined && typeof options.static !== "boolean") {
		await fuseStatic(fastify, options.static);
	} else if (options.static !== false) {
		// Register the default 'public' directory if they are not specified
		const defaultStaticPath = [
			{
				dir: path.resolve("./public"),
				path: "/",
			},
		];
		await fuseStatic(fastify, defaultStaticPath);
	}

	// Register the helmet security headers
	if (options.helmet !== undefined && typeof options.helmet !== "boolean") {
		await fuseHelmet(fastify, options.helmet);
	} else if (options.helmet !== false) {
		// Register the default helmet options if they are not specified
		await fuseHelmet(fastify, defaultFastifyHelmetOptions);
	}

	// Register the rate limit
	if (
		options.rateLimit !== undefined &&
		typeof options.rateLimit !== "boolean"
	) {
		await fuseRateLimit(fastify, options.rateLimit);
	} else if (options.rateLimit !== false) {
		// Register the default rate limit options if they are not specified
		await fuseRateLimit(fastify, defaultFastifyRateLimitOptions);
	}

	// Register the CORS
	if (options.cors !== undefined && typeof options.cors !== "boolean") {
		await fuseCors(fastify, options.cors);
	} else if (options.cors !== false) {
		// Register the default CORS options if they are not specified
		await fuseCors(fastify, defaultFastifyCorsOptions);
	}

	// Register the open api
	if (options.openApi !== undefined && typeof options.openApi !== "boolean") {
		await fuseOpenApi(fastify, options.openApi);
	} else if (options.openApi !== false) {
		// Register the default open api options if they are not specified
		await fuseOpenApi(fastify);
	}
}
