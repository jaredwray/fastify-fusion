import {describe, test, expect} from 'vitest';
import fastify from 'fastify';
import {
	fuse, type FuseOptions,
} from '../src/index.js';

describe('Open API', async () => {
	test('should be able to fuse with OpenAPI', async () => {
		const app = fastify();
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
		const app = fastify();
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

	test('should be able to access the OpenAPI defaults', async () => {
		const app = fastify();
		const options: FuseOptions = {
			openApi: true,
		};
		await fuse(app, options);
		const response = await app.inject({
			method: 'GET',
			url: '/',
		});

		const openApiResponse = await app.inject({
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
		const app = fastify();
		const options: FuseOptions = {
			openApi: {
				docsRoutePath: '/docs',
			},
		};
		await fuse(app, options);
		const response = await app.inject({
			method: 'GET',
			url: '/docs',
		});

		const scalarResponse = await app.inject({
			method: 'GET',
			url: '/docs-ux/browser/standalone.js',
		});

		const openApiResponse = await app.inject({
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
		expect(scalarResponse.body).toContain('scalar');
	});
});
