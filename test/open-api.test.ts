import {describe, test, expect} from 'vitest';
import Fastify from 'fastify';
import {
	fuse, type FuseOptions,
} from '../src/index.js';

describe('Open API', async () => {
	test('should be able to fuse with OpenAPI', async () => {
		// eslint-disable-next-line new-cap
		const app = Fastify();
		const options: FuseOptions = {
			static: true,
			openApi: true,
		};
		await fuse(app, options);
		expect(app).toBeDefined();
		expect(app).toBeTypeOf('object');
		expect(app.server).toBeDefined();
		expect(app.server).toBeTypeOf('object');
	});

	test('should be able to fuse with OpenAPI', async () => {
		// eslint-disable-next-line new-cap
		const app = Fastify();
		const options: FuseOptions = {
			static: true,
			openApi: {
				docsRoutePath: '/docs',
			},
		};
		await fuse(app, options);
		expect(app).toBeDefined();
		expect(app).toBeTypeOf('object');
		expect(app.server).toBeDefined();
		expect(app.server).toBeTypeOf('object');
	});

	test('should be able to access the OpenAPI defaults', async () => {
		// eslint-disable-next-line new-cap
		const fastify = Fastify();
		const options: FuseOptions = {
			static: true,
			openApi: true,
		};
		await fuse(fastify, options);
		const response = await fastify.inject({
			method: 'GET',
			url: '/',
		});

		const openApiResponse = await fastify.inject({
			method: 'GET',
			url: '/openapi/json',
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
		expect(response.body).toContain('data-url="/openapi/json"');

		expect(openApiResponse.statusCode).toBe(200);
		expect(openApiResponse.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(openApiResponse.body).toContain('"openapi":');
	});

	test('should be able to access the OpenAPI docs', async () => {
		// eslint-disable-next-line new-cap
		const fastify = Fastify();
		const options: FuseOptions = {
			static: true,
			openApi: {
				docsRoutePath: '/docs',
			},
		};
		await fuse(fastify, options);
		const response = await fastify.inject({
			method: 'GET',
			url: '/docs',
		});

		const scalarResponse = await fastify.inject({
			method: 'GET',
			url: '/scalar/browser/standalone.js',
		});

		const openApiResponse = await fastify.inject({
			method: 'GET',
			url: '/openapi/json',
		});

		expect(response.statusCode).toBe(200);
		expect(response.headers['content-type']).toBe('text/html; charset=utf-8');
		expect(response.body).toContain('data-url="/openapi/json"');

		expect(openApiResponse.statusCode).toBe(200);
		expect(openApiResponse.headers['content-type']).toBe('application/json; charset=utf-8');
		expect(openApiResponse.body).toContain('"openapi":');

		expect(scalarResponse.statusCode).toBe(200);
	});
});
