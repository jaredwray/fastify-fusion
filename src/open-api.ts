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
};

export const defaultOpenApiOptions = {
	title: 'Open API Documentation',
	description: 'API Documentation for the Service',
	version: '0.0.0',
	openApiRoutePrefix: '/openapi',
	docsRoutePath: '/',
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

export async function fuseOpenApi(fastify: FastifyInstance, options?: OpenApiOptions): Promise<void> {
	// Register swagger
	const config = defaultOpenApiOptions;
	const pkg = await readPackageUp();
	// Set the pkg info
	if (pkg && pkg.packageJson) {
		config.title = pkg.packageJson.name ?? defaultOpenApiOptions.title;
		config.description = pkg.packageJson.description ?? defaultOpenApiOptions.description;
		config.version = pkg.packageJson.version ?? defaultOpenApiOptions.version;
	}

	if (options) {
		config.title = options.title ?? pkg?.packageJson.name ?? defaultOpenApiOptions.title;
		config.description = options.description ?? pkg?.packageJson.description ?? defaultOpenApiOptions.description;
		config.version = options.version ?? pkg?.packageJson.version ?? defaultOpenApiOptions.version;
		config.openApiRoutePrefix = options.openApiRoutePrefix ?? defaultOpenApiOptions.openApiRoutePrefix;
		config.docsRoutePath = options.docsRoutePath ?? defaultOpenApiOptions.docsRoutePath;
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

	fastify.log.info(`Fasity OpenAPI Registered: ${JSON.stringify(config)}`);

	// Register the docs route
	await indexRoute(fastify, config);

	fastify.log.info(`Fasity API Docs Registered: ${config.docsRoutePath}`);
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

              <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.31.17/dist/browser/standalone.min.js"></script>
            </body>
            </html>
            `;
		await reply.type('text/html; charset=utf-8').send(redocHtml);
	});
}

