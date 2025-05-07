import {type FastifyInstance} from 'fastify';
import pino, {type LoggerOptions} from 'pino';

export const logConfig = {
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			translateTime: true,
			ignore: 'pid,hostname',
			singleLine: true,
		},
	},
};

export async function registerLog(fastify: FastifyInstance, options: LoggerOptions): Promise<void> {
	fastify.log = pino(options);
	fastify.log.info('logging registered');
}

export type {LoggerOptions} from 'pino';
