import {describe, test, expect} from 'vitest';
import fastify from 'fastify';
import {StaticPathOptions, registerStatic} from '../src/static.js';

describe('Static', async () => {
	test('should export all modules', async () => {
		expect(registerStatic).toBeDefined();
		expect(registerStatic).toBeTypeOf('function');
	});
});
