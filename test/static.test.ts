import path from 'node:path';
import {describe, test, expect} from 'vitest';
import fastify from 'fastify';
import {type StaticOptions, registerStatic} from '../src/static.js';

describe('Static', async () => {
	test('should export all modules', async () => {
		expect(registerStatic).toBeDefined();
		expect(registerStatic).toBeTypeOf('function');
	});
	test('should register static paths', async () => {
		const app = fastify();
		const options: StaticOptions = [
			{
				dir: 'test/fixtures',
				path: '/static',
			},
			{
				dir: path.resolve('test1/fixtures'),
				path: '/static1',
			},
		];
		await registerStatic(app, options);
		expect(app).toBeDefined();
	});
});
