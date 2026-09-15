# Defense in Depth

Tracking against https://github.com/jaredwray/agentic/blob/main/skills/security/defense-in-depth-nodejs/SKILL.md.

Profile: npm library · public

## 1. Security docs

- [x] `SECURITY.md` present — contact info + "How this repository is secured" summary — PR #103
- [x] `DEFENSE_IN_DEPTH.md` present (this file) — PR #103

## 2. CODEOWNERS and cloud bootstrap

- [x] `.github/CODEOWNERS` covers `/.github/`, `/.vscode/`, `/.cursor/`, `/.devcontainer/`, `/scripts/` with owners the maintainer names — PR #117
- [x] Codespaces and Cursor Cloud Agents bootstrap Aikido Safe Chain via scripts/setup-cloud-environment.sh (--ci shims, frozen lockfile) — PR #103, refreshed PR #119; Codespaces `github-cli` + `docker-in-docker` features PR #120
- [x] Dev Container `image` pinned by digest (`name:<tag>@sha256:<digest>`; not a floating tag) — PR #115

## 3. Dependencies (pnpm)

- [x] `packageManager: pnpm@11.3+` pinned in `package.json` — verified `pnpm@12.3.4+sha512.961aa41fb077da3a04a441d9f8e15ebc0c96da8ef710b2eb67bf9ee7cb0610eabd48f1fd85f51cffe73846785fa0f87c56a3a872a1d893f8446741b5cce45457`
- [x] 7-day cooldown: `minimumReleaseAge: 10080`, `minimumReleaseAgeStrict: true`, `minimumReleaseAgeIgnoreMissingTime: false`; no first-party `minimumReleaseAgeExclude` — PR #104
- [x] `trustPolicy: no-downgrade`; no first-party `trustPolicyExclude` — PR #104
- [x] Lifecycle scripts blocked: `strictDepBuilds: true`, `dangerouslyAllowAllBuilds: false`, `allowBuilds: {}` baseline — PR #104 (third-party `allowBuilds` exceptions: `@swc/core`, esbuild, workerd for the `wrangler` Pages-deploy toolchain)
- [x] `blockExoticSubdeps: true` — PR #104
- [x] Lockfile committed; CI installs with `pnpm install --frozen-lockfile` — PR #105
- [x] No `.github/dependabot.yml`; other dependency-update tools (if any) open PRs only — never auto-merge — verified

## 4. GitHub Actions

- [x] `permissions: contents: read` (or `{}` + per-job grants) on every workflow — PR #105
- [x] No `contents: write` except jobs whose purpose is mutating the repo (GitHub Release, Changesets version PR); generated output is a workflow artifact, never committed back from CI — PR #105
- [x] Every action pinned to a full commit SHA (`npx actions-up`) — PR #105
- [x] Every job installs Socket Firewall (`SocketDev/action` SHA-pinned, `firewall-version` pinned); `pnpm install` / `npm install` run as `sfw pnpm install` / `sfw npm install` — PR #105
- [x] `.github/workflows/check-workflows.yaml` lints workflows with zizmor on every PR — PR #105
- [x] Workflow `name:` and job `name:` contain no spaces (kebab-case) so they can be set as required status checks — PR #118
- [x] `persist-credentials: false` on checkouts that don't push — PR #105
- [x] No `pull_request_target` on workflows that run untrusted PR code — verified
- [x] Artifact-publishing workflows disable `actions/setup-node` default caching (`package-manager-cache: false`) to prevent cache poisoning — PR #105
- [x] No npm tokens (or other registry credentials) in Actions secrets — verified (no npm/registry tokens in workflow YAML; publish uses OIDC `id-token`)

## 5. npm publishing — npm libraries only

- [x] OIDC trusted publishing configured **stage-only** on npmjs.com for the publish workflow — it can stage, never publish live (manual) — maintainer-confirmed 2026-08-22
- [x] `.github/workflows/release.yaml` packs then stages with `pnpm stage publish ./packed/*.tgz --no-git-checks` — PR #105
- [x] Maintainer promotes staged versions with 2FA (manual) — maintainer-confirmed 2026-08-22
- [x] Drydock connected — staged releases reviewed before promotion (manual) — maintainer-confirmed 2026-08-22
- [x] No direct publish rights: package requires 2FA and disallows tokens (manual) — maintainer-confirmed 2026-08-22
- [x] `package.json` `repository.url` accurate so provenance maps to this repo — verified

## 6. Security tooling

- [x] Aikido runs on every build — verified (Aikido Security GitHub app on pull requests)
- [x] Aikido release gate: the release workflow's stage-publish job `needs:` a passing `scan-release` — PR #105
- [x] Socket reviews every PR that changes dependencies — verified (Socket Security GitHub app on pull requests)

## 7. Repository lockdown

- [x] Phishing-resistant 2FA (passkeys / hardware keys) on the GitHub and npm accounts (manual) — maintainer-confirmed 2026-08-22
- [x] Recovery codes stored offline in a password manager (manual) — maintainer-confirmed 2026-08-22
- [x] `lockdown-repo.sh` applied by a repo admin (never committed to this repo); `--check` with `--required-checks` and `--allowed-actions` passes (PRs required on the default branch, merges blocked unless required status checks pass, tag ruleset, immutable releases, fork-PR approval (public repos), read-only workflow tokens, Actions allowlist, secret scanning, Dependabot disabled, private vulnerability reporting (public repos)) — applied 2026-08-22 (`--required-checks "test,zizmor"`; `--allowed-actions` GitHub-owned + verified + `zizmorcore/*,SocketDev/*,codecov/*,cloudflare/*`). `--check` from this cloud agent still 403s (`You are admin: false`); the apply log is the source of truth.
