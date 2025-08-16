import process from "node:process";
import fastify from "fastify";
import { describe, expect, test } from "vitest";
import type { FuseOptions } from "../src/index.js";

describe("Open API", () => {
	test("should be able to fuse with OpenAPI", async () => {
		const { fuse } = await import("../src/index.js");
		const app = fastify();
		const options: FuseOptions = {
			static: true,
			openApi: true,
		};

		await fuse(app, options);

		expect(app).toBeDefined();
		expect(app).toBeTypeOf("object");
		expect(app.server).toBeDefined();
		expect(app.server).toBeTypeOf("object");
	});

	test("should be able to access the OpenAPI defaults", async () => {
		const { fuse } = await import("../src/index.js");
		const app = fastify();
		const options: FuseOptions = {
			openApi: true,
		};

		await fuse(app, options);

		const response = await app.inject({
			method: "GET",
			url: "/",
		});

		const openApiResponse = await app.inject({
			method: "GET",
			url: "/openapi/json",
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers["content-type"]).toBe("text/html; charset=utf-8");
		expect(response.body).toContain('data-url="/openapi/json"');

		expect(openApiResponse.statusCode).toBe(200);
		expect(openApiResponse.headers["content-type"]).toBe(
			"application/json; charset=utf-8",
		);
		expect(openApiResponse.body).toContain('"openapi":');
	});

	test("should be able to access the OpenAPI docs", async () => {
		const { fuse } = await import("../src/index.js");
		const app = fastify();
		const options: FuseOptions = {
			openApi: {
				docsRoutePath: "/docs",
			},
		};

		await fuse(app, options);

		const response = await app.inject({
			method: "GET",
			url: "/docs",
		});

		const openApiResponse = await app.inject({
			method: "GET",
			url: "/openapi/json",
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers["content-type"]).toBe("text/html; charset=utf-8");
		expect(response.body).toContain('data-url="/openapi/json"');

		expect(openApiResponse.statusCode).toBe(200);
		expect(openApiResponse.headers["content-type"]).toBe(
			"application/json; charset=utf-8",
		);
		expect(openApiResponse.body).toContain('"openapi":');
	});

	test("should respect a custom OpenAPI route prefix", async () => {
		const { fuse } = await import("../src/index.js");
		const app = fastify();
		const options: FuseOptions = {
			openApi: {
				openApiRoutePrefix: "/specs",
			},
		};

		await fuse(app, options);

		const response = await app.inject({
			method: "GET",
			url: "/",
		});

		const openApiResponse = await app.inject({
			method: "GET",
			url: "/specs/json",
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers["content-type"]).toBe("text/html; charset=utf-8");
		expect(response.body).toContain('data-url="/specs/json"');

		expect(openApiResponse.statusCode).toBe(200);
		expect(openApiResponse.headers["content-type"]).toBe(
			"application/json; charset=utf-8",
		);
		expect(openApiResponse.body).toContain('"openapi":');
	});

	test("should not mutate default configs when options provided", async () => {
		const { fuseOpenApi, defaultOpenApiOptions, fastifySwaggerConfig } =
			await import("../src/open-api.js");
		const app = fastify();

		const defaultOptions = structuredClone(defaultOpenApiOptions);
		const defaultSwagger = structuredClone(fastifySwaggerConfig);

		await fuseOpenApi(app, {
			title: "custom",
			description: "custom",
			version: "1.0.0",
			openApiRoutePrefix: "/specs",
			docsRoutePath: "/docs",
		});

		expect(defaultOpenApiOptions).toEqual(defaultOptions);
		expect(fastifySwaggerConfig).toEqual(defaultSwagger);
	});

	test("should use defaults when package info missing", async () => {
		const { fuseOpenApi } = await import("../src/open-api.js");
		const cwd = process.cwd();
		process.chdir("/tmp");

		const app = fastify();
		await fuseOpenApi(app);

		process.chdir(cwd);

		const response = await app.inject({ method: "GET", url: "/" });
		const openApiResponse = await app.inject({
			method: "GET",
			url: "/openapi/json",
		});

		expect(response.statusCode).toBe(200);
		expect(openApiResponse.statusCode).toBe(200);
	});

	test("indexRoute uses defaults when options missing", async () => {
		const { indexRoute, fuseOpenApi } = await import("../src/open-api.js");

		// Cover fuseOpenApi with options provided
		const appWithOptions = fastify();
		await fuseOpenApi(appWithOptions, { title: "t" });

		// Cover fuseOpenApi with defaults (no options)
		const appWithDefaults = fastify();
		await fuseOpenApi(appWithDefaults);

		const app = fastify();
		await indexRoute(app);

		const response = await app.inject({ method: "GET", url: "/" });

		expect(response.statusCode).toBe(200);
		expect(response.headers["content-type"]).toBe("text/html; charset=utf-8");
		expect(response.body).toContain('data-url="/openapi/json"');
	});
});
