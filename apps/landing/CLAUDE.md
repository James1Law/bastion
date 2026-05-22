# CLAUDE.md — `apps/landing`

Landing page for Bastion. The root [`CLAUDE.md`](../../CLAUDE.md) covers global rules; this file covers landing-page-specific things.

## Goal of v1

Someone lands on the page and within 10 seconds knows:

1. Bastion is a secure IDE concept.
2. It's for modern AI-assisted / fast-moving developers.
3. It protects against supply-chain and developer-environment risk.
4. Security is enforced **by default**, not bolted on.
5. The brand feels credible and worth exploring further.

If a section doesn't reinforce one of those, cut it.

## Page structure (target)

Implement in this order. Keep each section in its own file under `src/sections/`.

1. **Hero** — logo, headline, subhead, primary + secondary CTA, animated hero visual (fake IDE/security panel).
2. **Problem** — "AI makes developers faster. It does not make them safer."
3. **Solution / Product concept** — Bastion turns security into the default path.
4. **Feature detail** — GitHub Actions protection (Zizmor), dependency firewall, extension control, local security agent, secrets protection.
5. **How it works** — 5-step flow, animated where it earns its keep.
6. **Audience** — vibe coders, founders, juniors, security-conscious teams, AI-assisted teams.
7. **Comparison** — VS Code vs. Bastion table.
8. **Final CTA** — waitlist form (visual-only in v1).

## File layout inside `src/`

```
src/
├── App.tsx                 # page composition only — no inline sections
├── main.tsx                # bootstrap, do not change unless needed
├── components/             # reusable UI primitives (Button, Card, etc.)
├── sections/               # one file per landing section (Hero.tsx, Problem.tsx…)
├── lib/                    # framework-agnostic utilities (cn(), formatters)
├── styles/
│   └── globals.css         # Tailwind import + @theme brand tokens
└── test/
    └── setup.ts            # Vitest setup (RTL matchers, cleanup)
```

`App.tsx` should be a thin composition of sections. If it grows logic, that logic belongs in a hook or `lib/`.

## Brand tokens

Defined in `src/styles/globals.css` under `@theme`. Use the utilities, not raw hex values.

| Token                         | Utility                  | Use for                             |
| ----------------------------- | ------------------------ | ----------------------------------- |
| `--color-bastion-bg`          | `bg-bastion-bg`          | Page background (near-black).       |
| `--color-bastion-surface`     | `bg-bastion-surface`     | Elevated panels, cards.             |
| `--color-bastion-border`      | `border-bastion-border`  | Subtle dividers, card borders.      |
| `--color-bastion-fg`          | `text-bastion-fg`        | Primary text.                       |
| `--color-bastion-muted`       | `text-bastion-muted`     | Secondary text, captions.           |
| `--color-bastion-accent`      | `bg/text-bastion-accent` | CTAs, security-state highlights.    |
| `--color-bastion-accent-soft` | (use via `bg-[]`)        | Glow effects, selection background. |

Need a new token? Add it to `@theme` in `globals.css`. Don't hard-code colours in components.

## Animation guidelines

- Default: subtle. `duration` in the 200–500ms range; `ease-out` for most things.
- Reserve dramatic motion for the hero moment — one impressive thing, not five.
- Always respect `prefers-reduced-motion`. Use Motion's `useReducedMotion()` hook or guard CSS transitions.
- Don't animate layout-shifting properties (use `transform`/`opacity`, not `top`/`width`).

## Waitlist form

POSTs to `/api/waitlist` (a Vercel edge function at `apps/landing/api/waitlist.ts`) which adds the contact to a Resend audience, sends a confirmation email to the user, and optionally pings an admin email with the full submission.

- **Required env vars** (set in Vercel): `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `WAITLIST_FROM_EMAIL`. Optional: `WAITLIST_NOTIFY_EMAIL`. See `.env.example` and the README for setup steps.
- **Form behaviour**: name + email required, role/company + "what are you building?" optional. Client-side validation (email regex, non-empty name) plus server-side re-validation. `idle → submitting → submitted | error` state machine; submit button disables with a spinner during the request; server errors surface via a top-of-form alert.
- **Accessibility**: every field has a `<label>`, error states use `aria-invalid` + `aria-describedby`, the form error is `role="alert"`, the success block is `role="status"` with `aria-live="polite"`. Tab order is name → email → role → building → submit.
- **Server behaviour**: duplicate-contact errors from Resend are treated as success. Email failures (confirmation or admin) are logged but don't fail the submission — the contact's already in the audience.

Tests live next to the component (`WaitlistForm.test.tsx`) and cover validation, fetch success, server-error response, and network failure. Mock `fetch` via `vi.stubGlobal` per test.

## Accessibility floor

- All interactive elements reachable by keyboard, with a visible focus ring.
- Colour contrast meets WCAG AA against `--color-bastion-bg`.
- Semantic HTML: real `<button>`, real `<a>`, real `<form>`. No clickable `<div>`s.
- Landmark structure: one `<main>`, sectioning elements, headings in order (no `h3` before `h2`).
- Run a quick check with browser devtools' a11y panel before claiming a section is done.

## Local dev

```bash
pnpm dev                                 # http://localhost:5173
pnpm --filter @bastion/landing build     # production build to dist/
pnpm --filter @bastion/landing preview   # serve the built site
pnpm --filter @bastion/landing test      # Vitest
pnpm --filter @bastion/landing test:e2e  # Playwright smoke
```
