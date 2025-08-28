import type { Cacheable } from "cacheable";

declare module "fastify" {
	interface FastifyInstance {
		cache: Cacheable;
	}
}
