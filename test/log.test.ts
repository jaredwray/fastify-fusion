import fastify from "fastify";
import { describe, expect, test } from "vitest";
import {
	defaultLoggingOptions,
	fuseLog,
	type LoggerOptions,
	logger,
} from "../src/log.js";

describe("Log", async () => {
	test("should export all modules", async () => {
		expect(fuseLog).toBeDefined();
		expect(fuseLog).toBeTypeOf("function");
		expect(defaultLoggingOptions).toBeDefined();
		expect(defaultLoggingOptions).toBeTypeOf("object");
	});
	test("should register log", async () => {
		const app = fastify();
		const options: LoggerOptions = {
			level: "info",
		};
		await fuseLog(app, options);
		expect(app).toBeDefined();
		expect(app).toBeTypeOf("object");
	});

	test("should get logger without options", async () => {
		const options: LoggerOptions = defaultLoggingOptions;
		const log = logger(options);
		expect(log).toBeDefined();
		expect(log).toBeTypeOf("object");

		const newLog = logger();
		expect(newLog).toBeDefined();
		expect(newLog).toBeTypeOf("object");
	});
});
