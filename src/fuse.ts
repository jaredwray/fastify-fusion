import path from 'node:path';
import {type FastifyInstance} from 'fastify';
import {type StaticOptions, registerStatic} from './static.js';
import {registerLog, logConfig, type LoggerOptions} from './log.js';

export type FuseOptions = {
	static?: boolean | StaticOptions;
	log?: boolean | LoggerOptions;
};

export async function fuse(fastify: FastifyInstance, options: FuseOptions): Promise<void> {
	// Register the logger
	if (options.log !== undefined && typeof options.log !== 'boolean') {
		await registerLog(fastify, options.log);
	} else if (options.log !== false) {
		// Register the default logger if they are not specified
		await registerLog(fastify, logConfig);
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
}
