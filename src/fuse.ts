import {type FastifyInstance} from 'fastify';
import {type StaticPathOptions, registerStatic} from './static.js';

export type FuseOptions = {
	static: StaticPathOptions;
};

export async function fuse(fastify: FastifyInstance, options: FuseOptions): Promise<void> {
	// Register the static paths
	if (options.static !== undefined) {
		await registerStatic(fastify, options.static);
	}
}
