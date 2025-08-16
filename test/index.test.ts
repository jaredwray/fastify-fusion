import fastify from "fastify";
import { describe, expect, test } from "vitest";
import {
	type FuseOptions,
	fuse,
	type StartOptions,
	start,
} from "../src/index.js";

describe("Fuse", async () => {
	test("should export all modules", async () => {
		expect(fuse).toBeDefined();
		expect(fuse).toBeTypeOf("function");
	});

	test("should execute fuse", async () => {
		const app = fastify();
		const options: FuseOptions = {
			static: true,
		};
		await fuse(app, options);
		expect(app).toBeDefined();
		expect(app).toBeTypeOf("object");
		expect(app.server).toBeDefined();
		expect(app.server).toBeTypeOf("object");
	});

	test("should be able to add in the log options", async () => {
		const app = fastify();
		const options: FuseOptions = {
			static: true,
			log: {
				level: "info",
			},
		};
		await fuse(app, options);
		expect(app).toBeDefined();
		expect(app).toBeTypeOf("object");
		expect(app.server).toBeDefined();
		expect(app.server).toBeTypeOf("object");
	});

	test("should be able to add in the static options", async () => {
		const app = fastify();
		const options: FuseOptions = {
			static: [
				{
					dir: "test/fixtures",
					path: "/static",
				},
			],
		};
		await fuse(app, options);
		expect(app).toBeDefined();
		expect(app).toBeTypeOf("object");
	});

	test("should be able to use the helmet options", async () => {
		const app = fastify();
		const options: FuseOptions = {
			static: true,
			helmet: {
				contentSecurityPolicy: false,
				hidePoweredBy: true,
			},
		};
		await fuse(app, options);
		expect(app).toBeDefined();
		expect(app).toBeTypeOf("object");
		expect(app.server).toBeDefined();
		expect(app.server).toBeTypeOf("object");
	});

	test("should be able to use the rate limit options", async () => {
		const app = fastify();
		const options: FuseOptions = {
			static: true,
			rateLimit: {
				max: 100,
			},
		};
		await fuse(app, options);
		expect(app).toBeDefined();
		expect(app).toBeTypeOf("object");
		expect(app.server).toBeDefined();
		expect(app.server).toBeTypeOf("object");
	});

	test("should be able to use the CORS options", async () => {
		const app = fastify();
		const options: FuseOptions = {
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
			},
		};
		await fuse(app, options);
		expect(app).toBeDefined();
		expect(app).toBeTypeOf("object");
		expect(app.server).toBeDefined();
		expect(app.server).toBeTypeOf("object");
	});
});

describe("Fastify Start", async () => {
	test("should start the fastify server", async () => {
		const app = fastify();
		expect(app).toBeDefined();
		await start(app);
		expect(app.server).toBeDefined();
		expect(app.server).toBeTypeOf("object");
	});

	test("should error on missing port via log", async () => {
		const app = fastify();
		const options: StartOptions = {
			port: undefined,
			host: "0.0.0.0",
			message: (host, port) =>
				`🌏 started successfully at http://${host}:${port}`,
		};
		options.port = undefined;
		let errorMessage = "";
		app.log.error = (error: unknown) => {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else if (typeof error === "string") {
				errorMessage = error;
			} else {
				errorMessage = String(error);
			}
		};

		expect(app).toBeDefined();
		await start(app, options);
		expect(app.server.listening).toBe(false);
		expect(errorMessage).toBe(
			"Port is not defined. Please set the PORT environment variable or provide a port in the options.",
		);
	});

	test("should error on missing host via log", async () => {
		const app = fastify();
		const options: StartOptions = {
			port: 3000,
			host: undefined,
			message: (host, port) =>
				`🌏 started successfully at http://${host}:${port}`,
		};
		options.host = undefined;
		let errorMessage = "";
		app.log.error = (error: unknown) => {
			if (error instanceof Error) {
				errorMessage = error.message;
			} else if (typeof error === "string") {
				errorMessage = error;
			} else {
				errorMessage = String(error);
			}
		};

		expect(app).toBeDefined();
		console.log("Starting app with options:", options);
		await start(app, options);
		expect(app.server.listening).toBe(false);
		expect(errorMessage).toBe(
			"Host is not defined. Please set the HOST environment variable or provide a host in the options.",
		);
	});
});
