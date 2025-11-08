import process from "node:process";
import type { FastifyInstance } from "fastify";

export type StartOptions = {
	port?: number;
	host?: string;
	message?: (host: string, port: number) => string;
};

export const defaultStartOptions: StartOptions = {
	port: 3000,
	host: "0.0.0.0",
	/* v8 ignore next -- @preserve */
	message: (host, port) => `🌏 started successfully at http://${host}:${port}`,
};

export async function start(
	fastify: FastifyInstance,
	options: StartOptions = defaultStartOptions,
): Promise<void> {
	try {
		const portString = process.env.PORT ?? options.port;

		const host = process.env.HOST ?? options.host;

		if (
			portString === undefined ||
			portString === null ||
			Number.isNaN(portString)
		) {
			throw new Error(
				"Port is not defined. Please set the PORT environment variable or provide a port in the options.",
			);
		}

		const port = Number(portString);

		if (host === undefined || host === null || host.trim() === "") {
			throw new Error(
				"Host is not defined. Please set the HOST environment variable or provide a host in the options.",
			);
		}

		await fastify.listen({ port, host });
	} catch (error) {
		/* c8 ignore next 4 */
		fastify.log.error(error);
	}
}

export {
	type CacheableOptions,
	defaultCacheableOptions,
	fuseCacheable,
} from "./cacheable.js";
export { type FuseOptions, fuse } from "./fuse.js";
export {
	defaultFastifyHelmetOptions,
	type FastifyHelmetOptions,
	fuseHelmet,
} from "./helmet.js";
export {
	defaultLoggingOptions,
	fuseLog,
	type LoggerOptions,
	logger,
} from "./log.js";
export { fuseOpenApi, type OpenApiOptions } from "./open-api.js";
export {
	defaultFastifyRateLimitOptions,
	type FastifyRateLimitOptions,
	fuseRateLimit,
} from "./rate-limit.js";
export type { StaticOptions, StaticPath } from "./static.js";
export { fuseStatic } from "./static.js";
import "./types.js";
