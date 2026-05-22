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

The waitlist form POSTs to a Vercel edge function at `apps/landing/api/waitlist.ts` that adds the contact to a Resend audience and sends a confirmation email.

#### What you'll need from Resend

Four pieces of info, all from your Resend dashboard:

| Resend dashboard page    | What you grab there                      | Maps to env var         |
| ------------------------ | ---------------------------------------- | ----------------------- |
| Audiences → your list    | The audience ID (UUID in the URL)        | `RESEND_AUDIENCE_ID`    |
| API Keys → new key       | The `re_…` key (shown once at creation)  | `RESEND_API_KEY`        |
| Domains → verified entry | A sender address on your verified domain | `WAITLIST_FROM_EMAIL`   |
| _(your own inbox)_       | Where signup notifications should land   | `WAITLIST_NOTIFY_EMAIL` |

#### Step 1 — Find your audience ID

Resend auto-creates a default audience called **"General"** the moment you sign up, so you don't need to create one. Go to **[resend.com/audiences](https://resend.com/audiences)** and click into it. The screen that asks you to "add contacts" _is_ the audience — it's empty because no one's signed up yet.

To get the ID:

- Look at your browser's URL bar. It'll be `https://resend.com/audiences/<uuid>`. That UUID is your `RESEND_AUDIENCE_ID`.
- You can rename "General" to something like "Bastion waitlist" from the audience header — doesn't change the ID.

#### Step 2 — Pick a sender (the fast way vs the proper way)

The `WAITLIST_FROM_EMAIL` value has to be on a domain Resend has verified.

**Fast (sandbox, no domain needed)**

Use `onboarding@resend.dev` as the value. Works immediately, lets you ship today. Limitations: emails come from `@resend.dev` (not your brand), and Resend will surface a "sandbox" badge in their dashboard. Fine for validating the flow.

**Proper (your own domain)**

If you have a domain you control (e.g. `bastion.dev`):

1. **[resend.com/domains](https://resend.com/domains)** → Add Domain → enter your domain.
2. Resend shows you ~3–4 DNS records to add (one SPF `TXT`, several DKIM `CNAME`, optionally DMARC). Add them at your DNS provider (Cloudflare, Namecheap, whatever).
3. Hit "Verify". Usually verifies in a few minutes once DNS propagates.
4. Now you can use any address on that domain — e.g. `hello@bastion.dev` — as `WAITLIST_FROM_EMAIL`.

You can start with the sandbox, ship to Vercel, validate the flow, _then_ upgrade to a real domain. Nothing in the code changes — just swap the env var value and redeploy.

#### Step 3 — Create an API key

**[resend.com/api-keys](https://resend.com/api-keys)** → "Create API Key".

- **Name** it something obvious (e.g. `bastion-vercel-prod`).
- **Permission**: "Full access" is the simplest choice for now (needs to both send emails and write to audiences). You can scope it down later.
- Resend shows the `re_…` key **once**. Copy it immediately into your password manager or directly into the Vercel env var below — if you lose it, you'll have to make a new one.

#### Step 4 — Set the env vars in Vercel

In the Vercel dashboard:

1. Open your **bastion** project.
2. **Settings → Environment Variables**.
3. Add each variable. For each, tick **Production** (and **Preview** if you want it to work on preview deploys too):

   | Variable                | Example value                                                 |
   | ----------------------- | ------------------------------------------------------------- |
   | `RESEND_API_KEY`        | `re_xxxxxxxxxxxxxxxxxxxx`                                     |
   | `RESEND_AUDIENCE_ID`    | `abc12345-6789-…` (UUID from step 1)                          |
   | `WAITLIST_FROM_EMAIL`   | `onboarding@resend.dev` _(sandbox)_ or `hello@yourdomain.com` |
   | `WAITLIST_NOTIFY_EMAIL` | _(optional)_ your own email — gets the full submission        |

4. **Redeploy** — env vars only apply to new builds. Go to **Deployments**, click the three-dot menu on the latest one, and pick **Redeploy**.

#### Step 5 — Test it end-to-end

1. Open your deployed site.
2. Submit the form with a real email of yours.
3. Within a few seconds you should see:
   - The form switch to the green "You're on the list" success state.
   - A confirmation email arrive in your inbox.
   - The contact appear in the Resend Audiences view.
   - If you set `WAITLIST_NOTIFY_EMAIL`, a separate "New Bastion waitlist signup" email there too.

#### Common pitfalls

- **"Temporarily unavailable" message on submit** → one of the three required env vars (`RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `WAITLIST_FROM_EMAIL`) is missing or empty in Vercel. The function returns 503 cleanly in that case so no data is lost.
- **Submission succeeds but no email arrives** → the contact was added to the audience but Resend rejected the send. Common cause: `WAITLIST_FROM_EMAIL` is on a domain that isn't verified yet. Check **Resend → Logs** for the bounce.
- **"Domain not verified" in Resend logs** → finish DNS verification, or temporarily set `WAITLIST_FROM_EMAIL` to `onboarding@resend.dev` while you wait.
- **Env vars added but it still doesn't work** → you forgot to redeploy. Vercel only injects env vars at build/cold-start.
- **Submitting twice with the same email** → handled. The second submission is treated as success (Resend rejects duplicates, our code maps that to OK).

See [`apps/landing/.env.example`](apps/landing/.env.example) for the env var shape if you want to test the endpoint locally.

## Contributing / working in this repo

Read [`CLAUDE.md`](CLAUDE.md) first — it's the operating manual for both humans and AI agents. It covers the stack, code conventions, testing policy, brand rules, and the dos/don'ts that keep the codebase coherent.

Conventional Commits are enforced via commitlint. Pre-commit hooks run lint + format on staged files. Do not bypass hooks with `--no-verify`.

The full project brief: [`docs/bastion-project-brief.md`](docs/bastion-project-brief.md).
