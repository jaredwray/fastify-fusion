import type { FastifyInstance } from "fastify";
import fastify from "fastify";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
	type CacheableOptions,
	defaultCacheableOptions,
	type FuseOptions,
	fuse,
	fuseCacheable,
} from "../src/index.js";

describe("Cacheable", () => {
	let app: FastifyInstance;

	beforeEach(() => {
		app = fastify();
	});

	afterEach(async () => {
		await app.close();
	});

	test("should export defaultCacheableOptions", () => {
		expect(defaultCacheableOptions).toBeDefined();
		expect(defaultCacheableOptions).toBeTypeOf("object");
		expect(defaultCacheableOptions.ttl).toBe("1h");
		expect(defaultCacheableOptions.stats).toBe(true);
		expect(defaultCacheableOptions.nonBlocking).toBe(true);
	});

	test("should export fuseCacheable function", () => {
		expect(fuseCacheable).toBeDefined();
		expect(fuseCacheable).toBeTypeOf("function");
	});

	test("should register cacheable with default options", async () => {
		await fuseCacheable(app);

		expect(app.cache).toBeDefined();
		expect(app.cache).toBeTypeOf("object");
		expect(app.cache.ttl).toBe("1h");
		expect(app.cache.stats).toBeDefined();
		expect(app.cache.nonBlocking).toBe(true);
	});

	test("should register cacheable with custom options", async () => {
		const options: CacheableOptions = {
			ttl: "30m",
			stats: false,
			nonBlocking: false,
		};

		await fuseCacheable(app, options);

		expect(app.cache).toBeDefined();
		expect(app.cache.ttl).toBe("30m");
		expect(app.cache.stats.enabled).toBe(false);
		expect(app.cache.nonBlocking).toBe(false);
	});

	test("should work with basic cache operations", async () => {
		await fuseCacheable(app);

		// Test set and get
		const result = await app.cache.set("test-key", "test-value");
		expect(result).toBe(true);

		const value = await app.cache.get("test-key");
		expect(value).toBe("test-value");
	});

	test("should work with TTL", async () => {
		await fuseCacheable(app, { ttl: 100 }); // 100ms TTL

		await app.cache.set("ttl-key", "ttl-value");
		const value1 = await app.cache.get("ttl-key");
		expect(value1).toBe("ttl-value");

		// Wait for TTL to expire
		await new Promise((resolve) => setTimeout(resolve, 150));

		const value2 = await app.cache.get("ttl-key");
		expect(value2).toBeUndefined();
	});

	test("should work with multiple keys using setMany and getMany", async () => {
		await fuseCacheable(app);

		const items = [
			{ key: "key1", value: "value1" },
			{ key: "key2", value: "value2" },
			{ key: "key3", value: "value3" },
		];

		const result = await app.cache.setMany(items);
		expect(result).toBe(true);

		const values = await app.cache.getMany(["key1", "key2", "key3"]);
		expect(values).toEqual(["value1", "value2", "value3"]);
	});

	test("should support has operation", async () => {
		await fuseCacheable(app);

		expect(await app.cache.has("nonexistent")).toBe(false);

		await app.cache.set("existing", "value");
		expect(await app.cache.has("existing")).toBe(true);
	});

	test("should support delete operation", async () => {
		await fuseCacheable(app);

		await app.cache.set("to-delete", "value");
		expect(await app.cache.has("to-delete")).toBe(true);

		const deleted = await app.cache.delete("to-delete");
		expect(deleted).toBe(true);
		expect(await app.cache.has("to-delete")).toBe(false);
	});

	test("should support clear operation", async () => {
		await fuseCacheable(app);

		await app.cache.set("key1", "value1");
		await app.cache.set("key2", "value2");

		await app.cache.clear();

		expect(await app.cache.has("key1")).toBe(false);
		expect(await app.cache.has("key2")).toBe(false);
	});

	test("should support take operation", async () => {
		await fuseCacheable(app);

		await app.cache.set("take-key", "take-value");

		const value = await app.cache.take("take-key");
		expect(value).toBe("take-value");

		// Key should no longer exist after take
		expect(await app.cache.has("take-key")).toBe(false);
	});

	test("should support wrap function for memoization", async () => {
		await fuseCacheable(app);

		let callCount = 0;
		const expensiveFunction = (input: string) => {
			callCount++;
			return `processed-${input}`;
		};

		const wrappedFunction = app.cache.wrap(expensiveFunction);

		// First call should execute the function
		const result1 = await wrappedFunction("test");
		expect(result1).toBe("processed-test");
		expect(callCount).toBe(1);

		// Second call should use cached result
		const result2 = await wrappedFunction("test");
		expect(result2).toBe("processed-test");
		expect(callCount).toBe(1); // Should not increment
	});

	test("should support getOrSet operation", async () => {
		await fuseCacheable(app);

		let callCount = 0;
		const computeValue = async () => {
			callCount++;
			return "computed-value";
		};

		// First call should compute and cache the value
		const result1 = await app.cache.getOrSet("getOrSet-key", computeValue);
		expect(result1).toBe("computed-value");
		expect(callCount).toBe(1);

		// Second call should return cached value
		const result2 = await app.cache.getOrSet("getOrSet-key", computeValue);
		expect(result2).toBe("computed-value");
		expect(callCount).toBe(1); // Should not increment
	});

	test("should collect statistics when enabled", async () => {
		await fuseCacheable(app, { stats: true });

		const initialHits = app.cache.stats.hits;
		const initialMisses = app.cache.stats.misses;
		const initialSets = app.cache.stats.sets;

		// Perform cache operations
		await app.cache.set("stats-key", "value");
		await app.cache.get("stats-key"); // Hit
		await app.cache.get("nonexistent"); // Miss

		expect(app.cache.stats.sets).toBe(initialSets + 1);
		expect(app.cache.stats.hits).toBe(initialHits + 1);
		expect(app.cache.stats.misses).toBe(initialMisses + 1);
	});

	test("should not collect statistics when disabled", async () => {
		await fuseCacheable(app, { stats: false });

		const initialHits = app.cache.stats.hits;
		const initialMisses = app.cache.stats.misses;

		// Perform cache operations
		await app.cache.set("no-stats-key", "value");
		await app.cache.get("no-stats-key");
		await app.cache.get("nonexistent");

		// Stats should remain the same since disabled
		expect(app.cache.stats.hits).toBe(initialHits);
		expect(app.cache.stats.misses).toBe(initialMisses);
	});

	test("should properly disconnect on close", async () => {
		await fuseCacheable(app);

		const disconnectSpy = vi.spyOn(app.cache, "disconnect");

		await app.close();

		expect(disconnectSpy).toHaveBeenCalled();
	});

	test("should log registration with options", async () => {
		const logSpy = vi.spyOn(app.log, "info");

		const options: CacheableOptions = { ttl: "2h" };
		await fuseCacheable(app, options);

		expect(logSpy).toHaveBeenCalledWith(
			`Fastify Cacheable Registered: ${JSON.stringify(options)}`,
		);
	});

	test("should work inside a route handler", async () => {
		await fuseCacheable(app);

		// Add a route that uses the cache
		app.get("/cached-data/:id", async (request, _reply) => {
			const id = (request.params as { id: string }).id;
			const cacheKey = `data:${id}`;

			// Try to get from cache first
			let data = await request.server.cache.get(cacheKey);

			if (!data) {
				// Simulate expensive operation
				data = { id, value: `processed-${id}`, timestamp: Date.now() };
				// Cache for 1 minute
				await request.server.cache.set(cacheKey, data, "1m");
			}

			return data;
		});

		await app.ready();

		// First request - should hit the "database" and cache
		const response1 = await app.inject({
			method: "GET",
			url: "/cached-data/test123",
		});

		expect(response1.statusCode).toBe(200);
		const data1 = JSON.parse(response1.payload);
		expect(data1.id).toBe("test123");
		expect(data1.value).toBe("processed-test123");
		expect(data1.timestamp).toBeDefined();

		// Second request - should hit the cache
		const response2 = await app.inject({
			method: "GET",
			url: "/cached-data/test123",
		});

		expect(response2.statusCode).toBe(200);
		const data2 = JSON.parse(response2.payload);
		expect(data2.id).toBe("test123");
		expect(data2.value).toBe("processed-test123");
		// Should be the same timestamp (from cache)
		expect(data2.timestamp).toBe(data1.timestamp);

		// Verify the cache contains the data
		const cachedData = await app.cache.get("data:test123");
		expect(cachedData).toEqual(data1);
	});
});

describe("Cacheable integration with Fuse", () => {
	let app: FastifyInstance;

	beforeEach(() => {
		app = fastify();
	});

	afterEach(async () => {
		await app.close();
	});

	test("should register cache by default", async () => {
		await fuse(app);

		expect(app.cache).toBeDefined();
		expect(app.cache.ttl).toBe("1h");
	});

	test("should register cache with custom options in fuse", async () => {
		const options: FuseOptions = {
			cache: {
				ttl: "45m",
				stats: false,
			},
		};

		await fuse(app, options);

		expect(app.cache).toBeDefined();
		expect(app.cache.ttl).toBe("45m");
		expect(app.cache.stats.enabled).toBe(false);
	});

	test("should disable cache when set to false", async () => {
		const options: FuseOptions = {
			cache: false,
		};

		await fuse(app, options);

		// Should not have cache property when disabled
		expect(app.cache).toBeUndefined();
	});

	test("should use boolean true for default cache options", async () => {
		const options: FuseOptions = {
			cache: true,
		};

		await fuse(app, options);

		expect(app.cache).toBeDefined();
		expect(app.cache.ttl).toBe("1h");
		expect(app.cache.stats.enabled).toBe(true);
	});
});
