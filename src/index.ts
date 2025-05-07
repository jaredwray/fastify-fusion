import Fastify, {type FastifyInstance} from 'fastify';
import {type FuseOptions, fuse} from './fuse.js';

export {fuse, type FuseOptions} from './fuse.js';
export {registerStatic} from './static.js';
export type {StaticPath, StaticOptions} from './static.js';
export {registerLog, type LoggerOptions, logConfig} from './log.js';

export async function fastify(options?: FuseOptions): Promise<FastifyInstance> {
	// eslint-disable-next-line new-cap
	const fastify = Fastify();

	await fuse(fastify, options);

	return fastify;
}
