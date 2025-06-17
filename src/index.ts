import process from 'node:process';
import Fastify, {type FastifyInstance} from 'fastify';
import {type FuseOptions, fuse} from './fuse.js';

export {fuse, type FuseOptions} from './fuse.js';
export {registerStatic} from './static.js';
export type {StaticPath, StaticOptions} from './static.js';
export {registerLog, type LoggerOptions, defaultLoggingOptions} from './log.js';

export async function fastify(options?: FuseOptions): Promise<FastifyInstance> {
	// eslint-disable-next-line new-cap
	const fastify = Fastify();

	await fuse(fastify, options);

	return fastify;
}

export type StartOptions = {
	port?: number;
	host?: string;
	message?: (host: string, port: number) => string;
};

export const defaultStartOptions: StartOptions = {
	port: 3000,
	host: '0.0.0.0',
	message: (host, port) => `🌏 started successfully at http://${host}:${port}`,
};

export async function start(fastify: FastifyInstance, options: StartOptions = defaultStartOptions): Promise<void> {
	try {
		const portString = process.env.PORT ?? options.port;

		const host = process.env.HOST ?? options.host;

		if (portString === undefined || portString === null || Number.isNaN(portString)) {
			throw new Error('Port is not defined. Please set the PORT environment variable or provide a port in the options.');
		}

		const port = Number(portString);

		if (host === undefined || host === null || host.trim() === '') {
			throw new Error('Host is not defined. Please set the HOST environment variable or provide a host in the options.');
		}

		let message = `🌏 started successfully at http://${host}:${port}`;
		if (options.message !== undefined && typeof options.message === 'function') {
			message = options.message(host, port);
		}

		await fastify.listen({port, host});
		fastify.log.info(message);
	} catch (error) {
		/* c8 ignore next 4 */
		fastify.log.error(error);
	}
}
