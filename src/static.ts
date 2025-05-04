import path from 'node:path';
import {type FastifyInstance} from 'fastify';
import fastifyStatic from '@fastify/static';

export type StaticPath = {
	dir: string;
	path: string;
};

export type StaticPathOptions = StaticPath[];

export async function registerStatic(fastify: FastifyInstance, options?: StaticPathOptions): Promise<void> {
	if (Array.isArray(options)) {
		for (const staticPath of options) {
			let rootPath = staticPath.dir;
			if (!path.isAbsolute(rootPath)) {
				rootPath = path.resolve(rootPath);
			}

			// eslint-disable-next-line no-await-in-loop
			await fastify.register(fastifyStatic, {
				root: rootPath,
				prefix: staticPath.path,
				decorateReply: false,
			});
			fastify.log.info(`Static path registered: ${staticPath.path} -> ${rootPath}`);
		}
	} else {
		// Register the default 'public' directory if they are not specified
		await fastify.register(fastifyStatic, {
			root: path.resolve('./public'),
			prefix: '/',
			decorateReply: false,
		});
		fastify.log.info(`Static path registered: / -> ${path.resolve('./public')}`);
	}
}
