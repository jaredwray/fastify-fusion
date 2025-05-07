import {describe, test, expect} from 'vitest';
import Fastify from 'fastify';
import {fuse, fastify, type FuseOptions} from '../src/index.js';

describe('Fuse', async () => {
	test('should export all modules', async () => {
		expect(fuse).toBeDefined();
		expect(fuse).toBeTypeOf('function');
	});
	test('should execute fuse', async () => {
		// eslint-disable-next-line new-cap
		const app = Fastify();
		const options: FuseOptions = {
			static: true,
		};
		await fuse(app, options);
		expect(app).toBeDefined();
		expect(app).toBeTypeOf('object');
		expect(app.server).toBeDefined();
		expect(app.server).toBeTypeOf('object');
	});
	test('should be able to add in the log options', async () => {
		// eslint-disable-next-line new-cap
		const app = Fastify();
		const options: FuseOptions = {
			static: true,
			log: {
				level: 'info',
			},
		};
		await fuse(app, options);
		expect(app).toBeDefined();
		expect(app).toBeTypeOf('object');
		expect(app.server).toBeDefined();
		expect(app.server).toBeTypeOf('object');
	});
	test('should be able to add in the static options', async () => {
		// eslint-disable-next-line new-cap
		const app = Fastify();
		const options: FuseOptions = {
			static: [
				{
					dir: 'test/fixtures',
					path: '/static',
				},
			],
		};
		await fuse(app, options);
		expect(app).toBeDefined();
		expect(app).toBeTypeOf('object');
	});
	test('should be able to use fastify function', async () => {
		const app = await fastify();
		expect(app).toBeDefined();
		expect(app).toBeTypeOf('object');
		expect(app.server).toBeDefined();
		expect(app.server).toBeTypeOf('object');
	});
});
