
import type {FastifyInstance} from 'fastify';
import {fastifyCors, type FastifyCorsOptions} from '@fastify/cors';

export const defaultFastifyCorsOptions: FastifyCorsOptions = {
	origin: true, // Allow all origins
	methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Bearer'], // Allowed headers
	exposedHeaders: ['Content-Length', 'X-Requested-With'], // Exposed headers
	credentials: true, // Allow credentials
};

export async function fuseCors(fastify: FastifyInstance, options: FastifyCorsOptions): Promise<void> {
	await fastify.register(fastifyCors, options);

	fastify.log.info(`Fasity CORS Registered: ${JSON.stringify(options)}`);
}

export type {FastifyCorsOptions} from '@fastify/cors';
