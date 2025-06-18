
import {type FastifyInstance} from 'fastify';
import {fastifyRateLimit, type FastifyRateLimitOptions} from '@fastify/rate-limit';

export const defaultFastifyRateLimitOptions: FastifyRateLimitOptions = {
	// Enable rate limiting
	global: true,
	// Limit to 100 requests per minute
	max: 500,
	// Time window for the rate limit
	timeWindow: 60_000, // 1 minute in milliseconds
	// allow list for local development and testing
	allowList: ['127.0.0.1', '0.0.0.0'],
};

export async function registerRateLimit(fastify: FastifyInstance, options: FastifyRateLimitOptions): Promise<void> {
	await fastify.register(fastifyRateLimit, options);

	fastify.log.info(`Fasity Rate Limit Registered: ${JSON.stringify(options)}`);
}

export type {FastifyRateLimitOptions} from '@fastify/rate-limit';
