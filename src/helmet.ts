
import type {FastifyInstance} from 'fastify';
import {fastifyHelmet, type FastifyHelmetOptions} from '@fastify/helmet';

export const defaultFastifyHelmetOptions: FastifyHelmetOptions = {
	// Turn off CSP (mostly for HTML) to avoid overhead
	contentSecurityPolicy: false,

	// Remove the X-Power-By header
	hidePoweredBy: true,

	// Prevent your API from being framed
	frameguard: {action: 'deny'},

	// Disable DNS prefetching
	dnsPrefetchControl: {allow: false},

	// Enable HSTS for one year on HTTPS endpoints
	hsts: {
		maxAge: 31_536_000, // 365 days in seconds
		includeSubDomains: true,
		preload: true,
	},

	// Block sniffing of MIME types
	noSniff: true,

	// Basic XSS protections
	xssFilter: true,

	// Don't send Referer at all
	referrerPolicy: {policy: 'no-referrer'},

	// Tighten cross-origin resource loading
	crossOriginResourcePolicy: {policy: 'same-origin'},

	// You generally don't need the embedder/policy on an API
	crossOriginEmbedderPolicy: false,

	// Leave CSP nonces off
	// eslint-disable-next-line @typescript-eslint/naming-convention
	enableCSPNonces: false,
};

export async function fuseHelmet(fastify: FastifyInstance, options: FastifyHelmetOptions): Promise<void> {
	await fastify.register(fastifyHelmet, options);

	fastify.log.info(`Fasity Helment Registered: ${JSON.stringify(options)}`);
}

export type {FastifyHelmetOptions} from '@fastify/helmet';
