import path from "node:path";
import fastifyStatic from "@fastify/static";
import type { FastifyInstance } from "fastify";

export type StaticPath = {
	dir: string;
	path: string;
};

export type StaticOptions = StaticPath[];

export async function fuseStatic(
	fastify: FastifyInstance,
	options: StaticOptions,
): Promise<void> {
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
		fastify.log.info(
			`Static path registered: ${staticPath.path} -> ${rootPath}`,
		);
	}
}
