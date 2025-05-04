import {describe, test, expect} from 'vitest';
import fastify from 'fastify';
import {registerLog, type LoggerOptions, logConfig} from '../src/log.js';

describe('Log', async () => {
	test('should export all modules', async () => {
		expect(registerLog).toBeDefined();
		expect(registerLog).toBeTypeOf('function');
		expect(logConfig).toBeDefined();
		expect(logConfig).toBeTypeOf('object');
	});
	test('should register log', async () => {
		const app = fastify();
		const options: LoggerOptions = {
			level: 'info',
		};
		await registerLog(app, options);
		expect(app).toBeDefined();
		expect(app).toBeTypeOf('object');
	});
});
