import path from 'node:path';
import fastifyStatic from '@fastify/static';
import {type FastifyInstance, type FastifyRequest, type FastifyReply} from 'fastify';
import {fastifySwagger} from '@fastify/swagger';
import {fastifySwaggerUi} from '@fastify/swagger-ui';
import {readPackageUp} from 'read-package-up';

export type OpenApiOptions = {
	title?: string;
	description?: string;
	version?: string;
	openApiRoutePrefix?: string;
	docsRoutePath?: string;
	scalarPrefix?: string;
};

export const defaultOpenApiOptions = {
	title: 'Open API Documentation',
	description: 'API Documentation for the Service',
	version: '0.0.0',
	openApiRoutePrefix: '/openapi',
	docsRoutePath: '/',
	scalarPrefix: '/scalar',
};

export const fastifySwaggerConfig = {
	openapi: {
		info: {
			title: 'Open API Documentation',
			description: 'API Documentation for the Service',
			version: '0.0.0',
		},
		consumes: ['application/json'],
		produces: ['application/json'],
	},
};

export async function registerOpenApi(fastify: FastifyInstance, options?: OpenApiOptions): Promise<void> {
	// Register swagger
	const config = defaultOpenApiOptions;
	const pkg = await readPackageUp();
	if (options) {
		config.title = options.title ?? pkg?.packageJson.name ?? defaultOpenApiOptions.title;
		config.description = options.description ?? pkg?.packageJson.description ?? defaultOpenApiOptions.description;
		config.version = options.version ?? pkg?.packageJson.version ?? defaultOpenApiOptions.version;
		config.openApiRoutePrefix = options.openApiRoutePrefix ?? defaultOpenApiOptions.openApiRoutePrefix;
		config.scalarPrefix = options.scalarPrefix ?? defaultOpenApiOptions.scalarPrefix;
	}

	const swaggerConfig = fastifySwaggerConfig;
	swaggerConfig.openapi.info.title = config.title;
	swaggerConfig.openapi.info.description = config.description;
	swaggerConfig.openapi.info.version = config.version;

	await fastify.register(fastifySwagger, fastifySwaggerConfig);

	// Register the swagger ui
	await fastify.register(fastifySwaggerUi, {
		routePrefix: config.openApiRoutePrefix,
		uiConfig: {
			docExpansion: 'none',
			deepLinking: false,
		},
		uiHooks: {
			/* c8 ignore next 6 */
			onRequest(_request, _reply, next: () => void) {
				next();
			},
			preHandler(_request, _reply, next: () => void) {
				next();
			},
		},
		// eslint-disable-next-line @typescript-eslint/naming-convention
		staticCSP: true,

		transformSpecification: (swaggerObject, _request, _reply) => swaggerObject,
		transformSpecificationClone: true,
	});

	// Add static path for scalar from node modules
	await fastify.register(fastifyStatic, {
		root: path.resolve('./node_modules/@scalar/api-reference/dist'),
		prefix: config.scalarPrefix,
		decorateReply: false,
	});

	// Register the docs route
	await indexRoute(fastify, options);
}

export async function indexRoute(fastify: FastifyInstance, options?: OpenApiOptions): Promise<void> {
	const indexPath = options?.docsRoutePath ?? defaultOpenApiOptions.docsRoutePath;

	fastify.get(indexPath, {schema: {hide: true}}, async (_request: FastifyRequest, reply: FastifyReply) => {
		const openApiRoutePrefix = options?.openApiRoutePrefix ?? defaultOpenApiOptions.openApiRoutePrefix;

		const redocHtml = `
            <!doctype html>
            <html>
            <head>
              <title>Hyphen Notifyr</title>
              <meta charset="utf-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1" />
            </head>
            <body>

              <script
                id="api-reference"
                data-url="${openApiRoutePrefix}/json"></script>

              <script src="/scalar/browser/standalone.js"></script>
            </body>
            </html>
            `;
		await reply.type('text/html; charset=utf-8').send(redocHtml);
	});
}

