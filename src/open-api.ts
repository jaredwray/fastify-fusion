import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { readPackageUp } from "read-package-up";

export type OpenApiOptions = {
	title?: string;
	description?: string;
	version?: string;
	openApiRoutePrefix?: string;
	docsRoutePath?: string;
};

export const defaultOpenApiOptions = {
	title: "Open API Documentation",
	description: "API Documentation for the Service",
	version: "0.0.0",
	openApiRoutePrefix: "/openapi",
	docsRoutePath: "/",
};

export const fastifySwaggerConfig = {
	openapi: {
		info: {
			title: "Open API Documentation",
			description: "API Documentation for the Service",
			version: "0.0.0",
		},
		consumes: ["application/json"],
		produces: ["application/json"],
	},
};

export async function fuseOpenApi(
	fastify: FastifyInstance,
	options?: OpenApiOptions,
): Promise<void> {
	// Register swagger
	// clone the defaults so repeated calls don't mutate the exported objects
	const config: Required<OpenApiOptions> = structuredClone(
		defaultOpenApiOptions,
	);
	const pkg = await readPackageUp();

	config.title = options?.title ?? pkg?.packageJson?.name ?? config.title;
	config.description =
		options?.description ?? pkg?.packageJson?.description ?? config.description;
	config.version =
		options?.version ?? pkg?.packageJson?.version ?? config.version;
	config.openApiRoutePrefix =
		options?.openApiRoutePrefix ?? config.openApiRoutePrefix;
	config.docsRoutePath = options?.docsRoutePath ?? config.docsRoutePath;

	const swaggerConfig: typeof fastifySwaggerConfig =
		structuredClone(fastifySwaggerConfig);
	swaggerConfig.openapi.info.title = config.title;
	swaggerConfig.openapi.info.description = config.description;
	swaggerConfig.openapi.info.version = config.version;

	await fastify.register(fastifySwagger, swaggerConfig);

	// Register the swagger ui
	await fastify.register(fastifySwaggerUi, {
		routePrefix: config.openApiRoutePrefix,
		uiConfig: {
			docExpansion: "none",
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

	fastify.log.info(`Fastify OpenAPI Registered: ${JSON.stringify(config)}`);

	// Register the docs route
	await indexRoute(fastify, config);

	fastify.log.info(`Fastify API Docs Registered: ${config.docsRoutePath}`);
}

export async function indexRoute(
	fastify: FastifyInstance,
	options?: OpenApiOptions,
): Promise<void> {
	const indexPath =
		options?.docsRoutePath ?? defaultOpenApiOptions.docsRoutePath;

	fastify.get(
		indexPath,
		{ schema: { hide: true } },
		async (_request: FastifyRequest, reply: FastifyReply) => {
			const title = options?.title ?? defaultOpenApiOptions.title;
			const openApiRoutePrefix =
				options?.openApiRoutePrefix ?? defaultOpenApiOptions.openApiRoutePrefix;

			const redocHtml = `
            <!doctype html>
            <html>
            <head>
              <title>${title}</title>
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
			await reply.type("text/html; charset=utf-8").send(redocHtml);
		},
	);
}
