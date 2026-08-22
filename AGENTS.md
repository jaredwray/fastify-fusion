# Agents

Fastify-fusion is a Fastify API framework with best practices and plugins fused together to make it easy to build and maintain your API.

## Commands

- `pnpm test` - Run linting and tests with coverage (use after making changes)
- `pnpm build` - Build TypeScript to dist/
- `pnpm lint` - Run Biome linting with auto-fix

## Testing

- Always run `pnpm test` after making changes
- Goal: 100% code coverage
- Tests use Vitest with v8 coverage

## Code Style

- TypeScript strict mode
- Biome: tabs, double quotes
- ES modules

## Safe Chain

Package installs in this environment go through Aikido Safe Chain shims. Never bypass them:

- Keep `~/.safe-chain/shims` first on `PATH`.
- Do not call unshimmed `npm`, `pnpm`, `npx`, or `pnpx`.
- Do not install packages with `curl | sh` or by pointing at a package manager outside the shim directory.
