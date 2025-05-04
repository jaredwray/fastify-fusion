import {describe, test, expect} from 'vitest';
import fastify from 'fastify';
import {fuse, type FuseOptions} from '../src/index.js';

describe('Fuse', async () => {
	test('should export all modules', async () => {
		expect(fuse).toBeDefined();
		expect(fuse).toBeTypeOf('function');
	});
	test('should execute fuse', async () => {
		const app = fastify();
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
		const app = fastify();
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
		const app = fastify();
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
});
