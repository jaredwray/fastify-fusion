import {type FastifyInstance} from 'fastify';
import {fastifySwagger} from '@fastify/swagger';
import {fastifySwaggerUi} from '@fastify/swagger-ui';
import {readPackageUp} from 'read-package-up';

const packageUp = await readPackageUp({normalize: true});

const package_ = packageUp?.packageJson ?? {
	name: 'fastify-fuse',
	description: 'Fastify Fuse',
	version: '0.0.0',
};

export const fastifySwaggerConfig = {
	openapi: {
		info: {
			title: package_.name,
			description: package_.description,
			version: package_.version,
		},
		consumes: ['application/json'],
		produces: ['application/json'],
	},
};

export const defaultSwaggerOptions = {
	openapi: {
		info: {
			title: 'Fastify Fuse',
			description: 'Fastify Fuse API',
			version: '1.0.0',
		},
	},
	routePrefix: '/docs',
};

export type SwaggerOptions = {
	openapi?: {
		info: {
			title: string;
			description: string;
			version: string;
		};
	};
	routePrefix?: string;
};

export async function registerSwagger(fastify: FastifyInstance, options: SwaggerOptions): Promise<void> {
	const openApiConfig = fastifySwaggerConfig;

	if (options?.openapi) {
		openApiConfig.openapi.info.title = options.openapi.info.title;
		openApiConfig.openapi.info.description = options.openapi.info.description;
		openApiConfig.openapi.info.version = options.openapi.info.version;
	}

	await fastify.register(fastifySwagger, openApiConfig);

	await fastify.register(fastifySwaggerUi, {
		routePrefix: options?.routePrefix ?? '/docs',
		uiConfig: {
			docExpansion: 'none',
			deepLinking: false,
		},
		uiHooks: {
			/* c8 ignore next 6 */
			onRequest(_request, _reply, next) {
				next();
			},
			preHandler(_request, _reply, next) {
				next();
			},
		},
		// eslint-disable-next-line @typescript-eslint/naming-convention
		staticCSP: true,
		transformSpecification: (swaggerObject, _request, _reply) => swaggerObject,
		transformSpecificationClone: true,
	});
	fastify.log.info('Swagger registered');
}
