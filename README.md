# Bastion

> **Security by default.** The security-first IDE for AI-assisted development.

Bastion is an exploratory product concept: a hardened, security-first VS Code fork that protects against supply-chain risk, unsafe dependencies, compromised extensions, and insecure workflows — by default, not as an opt-in.

This repository is a pnpm workspace. The first deliverable is a landing page to validate the brand, positioning, and product story. The IDE itself is downstream of that.

> **Status: exploratory.** Early design + landing-page validation. Not yet a shipping product. Do not deploy this anywhere it could be mistaken for a finished tool.

---

## What's inside

```
bastion/
├── apps/
│   └── landing/        Vite + React 19 landing page (first deliverable)
├── packages/           Reserved for future shared libraries
├── assets/             Source-of-truth design assets (logo, brand)
├── docs/               Project brief, design references, decisions
├── CLAUDE.md           Operating manual for contributors (humans + AI agents)
└── apps/landing/CLAUDE.md   Landing-page-specific rules
```

## Tech stack

| Layer           | Choice                                                  |
| --------------- | ------------------------------------------------------- |
| Package manager | pnpm 10+ (workspaces)                                   |
| Runtime         | Node 22 LTS                                             |
| Build           | Vite 6                                                  |
| UI              | React 19 + TypeScript 5 (strict)                        |
| Styling         | Tailwind CSS v4 (CSS-first `@theme` tokens)             |
| Animation       | Motion (formerly Framer Motion)                         |
| Testing         | Vitest 3 + React Testing Library, Playwright            |
| Lint / format   | ESLint 9 (flat config) + Prettier 3                     |
| Git hooks       | Husky + lint-staged + commitlint (Conventional Commits) |

## Quick start

Requires Node 22+ and pnpm 10+ (see [`.nvmrc`](.nvmrc) and [`package.json`](package.json) `engines`).

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
pnpm format       # Prettier write
```

Run app-specific scripts via the filter flag:

```bash
pnpm --filter @bastion/landing build
```

## Deployment (Vercel)

Vercel auto-detects pnpm workspaces. For the landing app:

| Setting          | Value                           |
| ---------------- | ------------------------------- |
| Framework Preset | **Vite**                        |
| Root Directory   | `apps/landing`                  |
| Build Command    | _(leave default — Vite preset)_ |
| Output Directory | `dist`                          |
| Install Command  | _(leave default — pnpm auto)_   |
| Node Version     | 22.x                            |

Vercel installs from the workspace root automatically when it sees `pnpm-workspace.yaml`, so the lockfile is respected and only the landing app's dependencies are needed at build time.

### Waitlist backend (Resend)

The waitlist form POSTs to a Vercel edge function at `apps/landing/api/waitlist.ts` that adds the contact to a Resend audience and sends a confirmation email. To wire it up:

1. **Create a Resend account** at [resend.com](https://resend.com) and verify a sending domain (or use the `onboarding@resend.dev` sandbox while you're testing).
2. **Create an audience** in the Resend dashboard. Copy the ID.
3. **Create a server-side API key** at [resend.com/api-keys](https://resend.com/api-keys).
4. **Set these env vars in Vercel** (Project Settings → Environment Variables → Production):

   | Variable                | Value                                                 |
   | ----------------------- | ----------------------------------------------------- |
   | `RESEND_API_KEY`        | `re_…` (the API key from step 3)                      |
   | `RESEND_AUDIENCE_ID`    | The audience UUID from step 2                         |
   | `WAITLIST_FROM_EMAIL`   | A sender on your verified domain                      |
   | `WAITLIST_NOTIFY_EMAIL` | _(optional)_ email to receive rich submission details |

5. Redeploy. The form will now POST live and start adding contacts.

If any of the required vars are missing, the function returns `503` and the form shows a friendly "temporarily unavailable" message — no submissions are lost, but none are stored either. See [`apps/landing/.env.example`](apps/landing/.env.example) for the local-dev shape.

## Contributing / working in this repo

Read [`CLAUDE.md`](CLAUDE.md) first — it's the operating manual for both humans and AI agents. It covers the stack, code conventions, testing policy, brand rules, and the dos/don'ts that keep the codebase coherent.

Conventional Commits are enforced via commitlint. Pre-commit hooks run lint + format on staged files. Do not bypass hooks with `--no-verify`.

The full project brief: [`docs/bastion-project-brief.md`](docs/bastion-project-brief.md).
