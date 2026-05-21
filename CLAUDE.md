# CLAUDE.md — Bastion

This file is the operating manual for any AI agent (Claude Code, sub-agents, or otherwise) working in this repo. Read it first. Treat it as the project's spec, not just a hint.

## What this project is

Bastion is an exploratory product: a **security-first VS Code fork** that enforces security defaults instead of bolting them on. The first deliverable is a **polished landing page** that validates the brand, positioning, and product story. The IDE itself is downstream of that.

Full brief: [`docs/bastion-project-brief.md`](docs/bastion-project-brief.md). Visual reference for Cursor's design language (inspiration only — do not copy): [`docs/cursor-style-reference.md`](docs/cursor-style-reference.md).

The owner self-describes as a "vibe coder" but wants **robust, production-grade code**. Bias toward correctness, current best practice, and maintainability over speed-of-first-draft.

## Repository layout

```
.
├── apps/
│   └── landing/         # Vite + React 19 landing page (first deliverable)
├── packages/            # (empty) future shared libraries
├── assets/              # design source-of-truth (logo, brand assets)
├── docs/                # brief, style references, design decisions
├── eslint.config.js     # flat ESLint config — root applies to all apps/packages
├── tsconfig.base.json   # shared compiler options — apps extend this
├── pnpm-workspace.yaml  # workspace declaration
└── package.json         # workspace root scripts
```

When adding a new app or package: drop it under `apps/<name>/` or `packages/<name>/` and extend `tsconfig.base.json`. Do not start a new repo for an additional surface.

## Stack (locked-in defaults)

| Concern              | Choice                                       | Notes                                                                           |
| -------------------- | -------------------------------------------- | ------------------------------------------------------------------------------- |
| Package manager      | **pnpm 10+** (workspaces)                    | Never run `npm install` or `yarn` here. Use `pnpm` exclusively.                 |
| Runtime              | **Node 22 LTS**                              | Pinned via `.nvmrc`. `engines` field in root `package.json`.                    |
| Build                | **Vite 6**                                   | Per-app `vite.config.ts`.                                                       |
| UI runtime           | **React 19** + TypeScript 5.7+ strict        | `react-jsx` transform. `StrictMode` always on.                                  |
| Styling              | **Tailwind CSS v4** (CSS-first via `@theme`) | No `tailwind.config.js` — tokens live in `apps/landing/src/styles/globals.css`. |
| Animation            | **Motion** (`motion` package, ex Framer)     | Import from `motion/react`.                                                     |
| Component primitives | **shadcn/ui** when needed                    | Only add components you actually use. Do not bulk-install.                      |
| Icons                | Lucide React                                 | Add when first needed.                                                          |
| Linting              | **ESLint 9** flat config + Prettier 3        | One config at repo root, applies everywhere.                                    |
| Testing              | **Vitest 3** + RTL, **Playwright** smoke     | See "Testing policy" below.                                                     |
| Git hooks            | Husky + lint-staged                          | Pre-commit: lint+format on staged files. Commit-msg: commitlint.                |
| Commits              | **Conventional Commits**                     | `feat: …`, `fix: …`, `chore: …`, `docs: …`, `refactor: …`, `test: …`.           |

Do not introduce a new tool without a stated reason and the user's agreement. "It would be nice to have X" is not enough.

## Testing policy (pragmatic, not strict TDD)

Confirmed at init: pragmatic — not strict TDD.

**Write tests for:**

- Components with logic (forms with validation, hooks, state machines, anything stateful).
- Utility functions and data transforms.
- Accessibility-critical interactions (focus management, keyboard handling, ARIA semantics).
- Anything that has broken before, or that you'd be nervous to change without a safety net.

**Skip tests for:**

- Purely presentational components (a `<Hero>` whose only behaviour is "render some JSX").
- One-off marketing copy.
- Styles. Don't snapshot-test class names.

**One Playwright smoke test exists** at `apps/landing/e2e/smoke.spec.ts` — it loads the built page and asserts the hero renders. Add an E2E test only for **critical user flows** (e.g. the waitlist signup once it's wired up). Don't drown the suite in E2E coverage of static sections.

When you write a test, name it for the behaviour, not the implementation. Avoid testing internals (component state, private functions). Prefer Testing Library queries by role/label/text, not test IDs.

## Code conventions

- **TypeScript: strict, no escapes.** No `any`. No `// @ts-ignore` / `// @ts-expect-error` without an inline comment explaining why and (where applicable) a link to a tracking issue. Prefer `unknown` + a narrow over `any`.
- **No defensive code at internal boundaries.** Trust your own functions. Validate only at system boundaries (user input, network, env). Avoid try/catch that just rethrows.
- **No premature abstraction.** Three similar lines is fine. Wait until the fourth shape forces a real decision before extracting.
- **No dead code, no commented-out blocks, no TODO comments without an owner and date.** Delete or land it. Use git history for "what used to be here."
- **Comments explain WHY.** Skip the WHAT — names cover that. The one place comments are welcome: a non-obvious invariant, a workaround for a specific upstream bug (link it), or a behaviour that would surprise a reader.
- **Imports**: use the `@/` alias for `apps/landing/src/...` paths. Use `import type` for type-only imports (enforced by ESLint).
- **Components**: function components, named or `default` export depending on file convention. One component per file unless they're trivially co-located (a `Card` and `CardTitle` in the same file is fine).
- **Files**: kebab-case for non-component files (`use-waitlist.ts`), PascalCase for component files (`Hero.tsx`).

## Visual / brand rules

These are not negotiable for the landing page. They define what "feels like Bastion" vs. what feels generic.

- **Dark mode first.** Near-black surface (`--color-bastion-bg`, currently `#06090e`). No light theme on the landing page in v1.
- **Brand accent: `#26F27B`** — neon mint, from the logo. Use sparingly: CTAs, key highlights, security-state indicators. **Not** for body text, not for decorative gradients on every section.
- **No cliché cybersecurity imagery.** No hooded hackers. No glowing padlocks. No generic green binary rain. No matrix grids unless they're so subtle they read as texture.
- **Animation tone**: precise, restrained, premium. Smooth fades and subtle motion. Avoid bouncy springs, dramatic parallax, or anything that feels like a portfolio site.
- **Typography**: tight tracking on display sizes, generous line-height on body. Use `text-balance` on headlines, `text-pretty` on paragraphs.
- **Copy**: direct, confident, slightly urgent. **Never** alarmist, never corporate, never marketing-fluff. If a sentence could appear on any SaaS landing page, rewrite it.

When in doubt, ask: _"Does this look like a serious developer tool, or like a cybersecurity stock template?"_ Cut the second one.

## What to do / what to never do

### Do

- Run `pnpm typecheck && pnpm lint && pnpm test` before claiming work is done. Frontend regressions don't show up in unit tests alone — also run `pnpm dev` and look at the actual page when you change visual code.
- Keep commits atomic and conventional. One concern per commit.
- Prefer editing existing files over creating new ones.
- When adding a dependency, justify it in the commit message.
- Update this `CLAUDE.md` when you change a structural decision (stack, layout, testing policy). Memory and chat don't count — future agents read the file.

### Don't

- **Don't run `npm install` / `yarn` / `bun install`.** pnpm only.
- **Don't commit `.env*` files or credentials.** Use `.env.example` for shape, never with real values.
- **Don't add `tailwind.config.js`.** Tokens belong in `@theme` inside `globals.css` (Tailwind v4 pattern).
- **Don't introduce a UI library/framework (Chakra, MUI, etc.).** The stack is Tailwind + shadcn primitives. If you reach for something else, stop and ask.
- **Don't wire up a waitlist backend** without confirming the provider with the user. v1 form is visual-only — log to console or no-op on submit.
- **Don't generate marketing copy that overpromises.** Bastion is exploratory. "An IDE concept" is honest; "Trusted by Fortune 500" is a lie.
- **Don't bypass git hooks** (`--no-verify`). If a hook fails, fix the underlying issue.
- **Don't `git push --force` or rewrite shared history** without explicit user instruction.

## Workflow for agents

1. Read this file and the relevant `apps/<app>/CLAUDE.md` (if present) before starting.
2. If the task is non-trivial, use `TaskCreate` to plan the steps. Update statuses as you go.
3. Make changes. Run `pnpm typecheck`, `pnpm lint`, and relevant tests. If you touched UI, run `pnpm dev` and verify visually.
4. Stage and commit with a Conventional Commit message. Run multiple commits if the change spans concerns (e.g. one for a refactor, one for the feature it enables).
5. End-of-turn summary: one or two sentences. What changed, what's next.

If you're a sub-agent invoked for a specific task, your scope is the task — don't refactor adjacent code unless asked. Surface anything suspicious instead of fixing it silently.

## Useful commands

```bash
pnpm install                 # install everything in the workspace
pnpm dev                     # run the landing app (Vite dev server)
pnpm build                   # build all apps
pnpm preview                 # serve the production build of the landing page
pnpm typecheck               # tsc -b across the workspace
pnpm lint                    # ESLint across the workspace
pnpm lint:fix                # ESLint with auto-fix
pnpm format                  # Prettier write
pnpm test                    # Vitest run across the workspace
pnpm test:e2e                # Playwright smoke (builds + previews + tests)
pnpm --filter @bastion/landing <script>   # target the landing app explicitly
```

First-time Playwright setup:

```bash
pnpm --filter @bastion/landing run test:e2e:install
```
