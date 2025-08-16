import type { FastifyInstance } from "fastify";
import pino, { type LoggerOptions } from "pino";

export const defaultLoggingOptions = {
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: true,
			ignore: "pid,hostname",
			singleLine: true,
		},
	},
};

export async function fuseLog(
	fastify: FastifyInstance,
	options: LoggerOptions,
): Promise<void> {
	fastify.log = pino(options);
	fastify.log.info(`Fasity Logging Registered: ${JSON.stringify(options)}`);
}

export function logger(options?: LoggerOptions): pino.Logger {
	const options_ = options ?? defaultLoggingOptions;
	return pino(options_);
}

export type { LoggerOptions } from "pino";
