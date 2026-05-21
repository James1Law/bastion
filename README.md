# Bastion

> Security by default. The security-first IDE for AI-assisted development.

Bastion is an exploratory product concept: a hardened, security-first VS Code fork that protects against supply chain risk, unsafe dependencies, compromised extensions, and insecure workflows — by default, not as an opt-in.

This repository is a pnpm workspace. The first deliverable is the landing page that validates the brand and positioning.

## Repo layout

```
apps/
  landing/      Vite + React 19 landing page
packages/       (empty — reserved for future shared libraries)
assets/         Source-of-truth design assets (logo, etc.)
docs/           Brief, design references, decisions
```

## Quick start

Requires Node 22+ and pnpm 10+ (see `.nvmrc`).

```bash
pnpm install
pnpm dev          # → http://localhost:5173
```

Other scripts:

```bash
pnpm build        # build all apps
pnpm typecheck    # tsc -b across the workspace
pnpm lint         # ESLint
pnpm test         # Vitest
pnpm test:e2e     # Playwright smoke (builds + previews + tests)
```

## Working in this repo

Read [`CLAUDE.md`](CLAUDE.md) first — it's the operating manual for both humans and AI agents. It covers the stack, code conventions, testing policy, brand rules, and the dos/don'ts that keep the codebase coherent.

The project brief lives at [`docs/bastion-project-brief.md`](docs/bastion-project-brief.md).
