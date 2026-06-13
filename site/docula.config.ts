import type { DoculaOptions } from "docula";

export const options: Partial<DoculaOptions> = {
	// Pulls the README, releases (changelog) and contributors from this repo.
	githubPath: "jaredwray/fastify-fusion",
	siteTitle: "Fastify Fusion",
	siteDescription:
		"Fastify API framework with best practices and plugins fused together to make it easy to build and maintain your API.",
	siteUrl: "https://fastify-fusion.org",
	themeMode: "light",
	// Use the project README.md as the home page.
	autoReadme: true,
	// Build the changelog from the GitHub releases of githubPath.
	enableReleaseChangelog: true,
	enableLlmsTxt: true,
};
