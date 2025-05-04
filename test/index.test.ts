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
});
