import fastify from "fastify";
import { describe, expect, test } from "vitest";
import { defaultFastifyCorsOptions, fuseCors } from "../src/cors.js";

describe("CORS", async () => {
	test("should export all modules", async () => {
		expect(fuseCors).toBeDefined();
		expect(fuseCors).toBeTypeOf("function");
	});
	test("should register CORS", async () => {
		const app = fastify();
		await fuseCors(app, defaultFastifyCorsOptions);
		expect(app).toBeDefined();
	});
});
