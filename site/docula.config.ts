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

// The docula template already renders the site logo in the header. The project
// README.md also opens with a logo image, which `autoReadme` would render a
// second time in the home page body — producing a duplicate logo. Strip that
// leading image from the rendered README so only the header logo remains.
// README.md on disk is left untouched, so the logo still shows on GitHub and npm.
export const onAutoReadme = (content: string): string =>
	content.replace(/^!\[[^\]]*\]\([^)]*\)\s*\r?\n+/m, "");
