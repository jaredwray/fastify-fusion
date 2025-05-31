import {describe, test, expect} from 'vitest';
import fastify from 'fastify';
import {registerLog, type LoggerOptions, defaultLoggingOptions} from '../src/log.js';

describe('Log', async () => {
	test('should export all modules', async () => {
		expect(registerLog).toBeDefined();
		expect(registerLog).toBeTypeOf('function');
		expect(defaultLoggingOptions).toBeDefined();
		expect(defaultLoggingOptions).toBeTypeOf('object');
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
