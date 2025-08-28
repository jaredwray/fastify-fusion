import { Cacheable, type CacheableOptions } from "cacheable";
import type { FastifyInstance } from "fastify";

export const defaultCacheableOptions: CacheableOptions = {
	ttl: "1h", // Default 1 hour TTL
	stats: true, // Enable statistics by default
	nonBlocking: true, // Non-blocking secondary operations
};

export async function fuseCacheable(
	fastify: FastifyInstance,
	options: CacheableOptions = defaultCacheableOptions,
): Promise<void> {
	const cacheable = new Cacheable(options);

	// Register the cacheable instance as a decorator on the fastify instance
	fastify.decorate("cache", cacheable);

	// Add graceful shutdown handling
	fastify.addHook("onClose", async () => {
		await cacheable.disconnect();
	});

	fastify.log.info(`Fastify Cacheable Registered: ${JSON.stringify(options)}`);
}

export type { CacheableOptions } from "cacheable";
