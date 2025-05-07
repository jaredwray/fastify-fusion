import path from 'node:path';
import {type FastifyInstance} from 'fastify';
import {type StaticOptions, registerStatic} from './static.js';
import {registerLog, logConfig, type LoggerOptions} from './log.js';
import {registerSwagger, type SwaggerOptions, defaultSwaggerOptions} from './swagger.js';

export type FuseOptions = {
	static?: boolean | StaticOptions;
	log?: boolean | LoggerOptions;
	swagger?: boolean | SwaggerOptions;
};

export async function fuse(fastify: FastifyInstance, options?: FuseOptions): Promise<void> {
	// If no options are provided, use the default options
	if (options === undefined) {
		options = {
			static: true,
			log: true,
		};
	}

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

	// Register the swagger documentation
	if (options.swagger !== undefined && typeof options.swagger !== 'boolean') {
		await registerSwagger(fastify, options.swagger);
	} else if (options.swagger !== false) {
		// Register the default swagger documentation if they are not specified
		await registerSwagger(fastify, defaultSwaggerOptions);
	}
}
