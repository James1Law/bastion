# Bastion Landing Page Project Brief

## Project goal

Build a polished, high-impact landing page for **Bastion**, a security-first developer IDE aimed at reducing software supply chain risk for vibe coders, junior developers, small teams, and AI-assisted engineering workflows.

The landing page should make Bastion feel like a serious, premium, security-focused developer tool. It should communicate one core idea immediately:

> **Bastion is an IDE where security is enforced by default, not bolted on later.**

This project is currently exploratory. The first deliverable should be a strong landing page concept that helps validate the brand, positioning, messaging, and product story.

---

## Product idea

### Problem

Modern developers are building faster than ever, especially with AI coding tools and “vibe coding” workflows. But many developers, founders, and small teams do not have deep security knowledge.

This creates risk around:

- Supply chain attacks
- Malicious or compromised dependencies
- Unsafe GitHub Actions workflows
- Over-trusting VS Code extensions
- Auto-updating packages and extensions without review
- Secrets being committed accidentally
- Inexperienced developers shipping insecure code without knowing it

Existing tooling often expects developers to actively choose security. Bastion should flip that model.

### Solution

Bastion is a **security-first VS Code fork**, inspired by Cursor-style developer tooling, but hardened from the start.

It should feel familiar to developers, but with strong guardrails built in.

Possible security features include:

- **Zizmor linting for GitHub Actions** to catch workflow security issues
- **No automatic extension updates by default**
- **Minimum release age enforcement** for dependencies
- **npm installs gated through a Socket-style security firewall**
- **Local security agent** that runs checks on commit and pre-push
- **Secrets scanning before code leaves the machine**
- **Risk scoring for dependencies, extensions, and workflows**
- **Opinionated secure defaults** for developer environments

The product should feel like an IDE with a built-in security team.

---

## Target audience

The first version of the landing page should speak to:

- AI-assisted developers using tools like Cursor, Claude Code, Windsurf, v0, Replit, Bolt, or VS Code
- Startup founders building quickly without a security team
- Junior or inexperienced developers who want safer defaults
- Engineering teams concerned about supply chain risk
- Security-conscious CTOs and technical leads
- Teams experimenting with AI-generated code and agentic development

Tone should be direct, confident, and slightly urgent without sounding alarmist.

---

## Brand direction

### Name

Primary name for now: **Bastion**

Alternative name explored: **Kevlar**

Bastion currently feels stronger because it suggests protection, defence, structure, and a safe place to build from. It also has a more premium SaaS / developer-tool feel.

### Core positioning

Potential positioning lines:

- **Security by default.**
- **The security-first IDE for modern developers.**
- **Build fast. Ship safely.**
- **An IDE with guardrails built in.**
- **Cursor-speed development, hardened by default.**
- **Your secure base for AI-assisted development.**
- **Develop freely. Bastion protects.**

### Brand personality

Bastion should feel:

- Serious
- Technical
- Premium
- Protective
- Modern
- Developer-native
- Confident
- Not corporate or boring
- Not gimmicky cyber-security stock imagery

Avoid clichés like hooded hackers, glowing padlocks everywhere, or generic cyber grids unless used subtly.

---

## Visual direction

Use the generated Bastion logo/SVG as the starting point.

The visual system should lean towards:

- Dark mode first
- Deep black / near-black backgrounds
- Subtle gradients
- Neon green or mint security accents
- Fine grid lines, terminal details, or code-inspired textures
- Glassmorphism used sparingly
- Sharp, premium developer-tool UI
- High contrast sections
- Smooth animation and interaction

ReactBits.dev should be used as visual inspiration, especially for animated components, interactive backgrounds, and attention-grabbing UI moments.

Useful inspiration from ReactBits-style components may include:

- Animated text reveals
- Glowing gradient backgrounds
- Particles or subtle animated field effects
- Interactive cards
- Scroll-based reveal sections
- Code blocks with motion
- Spotlight/aurora style backgrounds
- Terminal-style interface panels
- Component cards that feel tactile and premium

The page should be impressive, but not distracting. It should still clearly explain the product.

---

## Suggested landing page structure

### 1. Hero section

Goal: Explain the product instantly and make it feel premium.

Content ideas:

- Bastion logo
- Main headline
- Short subheading
- Primary call to action
- Secondary call to action
- Hero visual showing an IDE/security dashboard hybrid

Example copy:

```text
The security-first IDE for AI-assisted development.
```

```text
Bastion is a hardened VS Code fork that protects your codebase from supply chain risk, unsafe dependencies, compromised extensions, and insecure workflows before they reach production.
```

CTA ideas:

- Join the waitlist
- Request early access
- See how it works
- View security model

Hero visual idea:

A dark IDE mockup with a security panel showing:

- Zizmor: 2 issues found
- Dependency release age: blocked
- Socket firewall: install blocked
- Secrets scan: passed
- Pre-push checks: passed

### 2. Problem section

Goal: Make the risk feel obvious.

Possible headline:

```text
AI makes developers faster. It does not make them safer.
```

Talking points:

- AI coding tools make it easy to build quickly
- Inexperienced developers may not understand dependency or workflow risk
- Supply chain attacks are becoming a practical threat, not a theoretical one
- Most tools warn after the fact, or require manual setup

### 3. Product concept section

Goal: Explain Bastion as an IDE with enforced security defaults.

Possible headline:

```text
Bastion turns security into the default path.
```

Explain that Bastion is familiar like VS Code, but with a hardened security layer.

Feature cards:

- Hardened extension updates
- Dependency firewall
- GitHub Actions linting
- Local commit protection
- Secrets scanning
- Minimum package age rules

### 4. Feature detail section

Goal: Give enough detail to sound credible.

Suggested features:

#### GitHub Actions protection

Use Zizmor to detect risky workflow patterns before they become attack paths.

#### Safer dependencies

Enforce minimum release age, block suspicious packages, and route npm installs through a Socket-style security firewall.

#### Extension control

Disable extension auto-updates by default and make extension changes explicit and reviewable.

#### Local security agent

Run checks on commit and pre-push so problems are caught before code leaves the machine.

#### Secrets protection

Scan for secrets locally and block risky commits before they reach GitHub.

### 5. “How it works” section

Goal: Make the product easy to understand.

Suggested flow:

1. Developer writes code in Bastion
2. Bastion monitors dependencies, extensions, workflows, and secrets
3. Risky actions are blocked or flagged locally
4. Pre-commit and pre-push checks enforce team policy
5. Safer code reaches GitHub

This section could be animated using cards, a horizontal timeline, or connected nodes.

### 6. Audience section

Goal: Make people recognise themselves.

Cards:

- For vibe coders
- For startup founders
- For junior developers
- For security-conscious teams
- For AI-assisted engineering teams

### 7. Comparison section

Goal: Show why this is different.

Possible comparison:

| Standard VS Code                 | Bastion                       |
| -------------------------------- | ----------------------------- |
| Security depends on user setup   | Security enabled by default   |
| Extensions auto-update           | Extension updates controlled  |
| Dependencies installed freely    | Risky installs blocked        |
| Secrets caught later             | Secrets blocked locally       |
| GitHub Actions risk often missed | Workflows linted before merge |
| Designed for flexibility         | Designed for safe speed       |

### 8. Final CTA

Goal: Convert interest into sign-ups.

Possible headline:

```text
Build fast without leaving the gates open.
```

CTA:

- Join the early access list
- Request a demo

---

## Initial technical direction

Use a modern React stack.

Recommended starting point:

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui where useful
- Framer Motion for animation
- ReactBits.dev components for visual inspiration and selected effects

The first version can be a static landing page. No backend is required initially unless adding a waitlist form.

For a waitlist form, keep it simple:

- Name
- Email
- Role/company optional
- “What are you building?” optional

Potential backend options later:

- Supabase
- Resend
- Formspree
- Loops
- ConvertKit
- Airtable

Do not over-engineer this at the start.

---

## Design requirements

The landing page should:

- Be mobile responsive
- Be dark-mode first
- Look premium and credible
- Use the Bastion SVG/logo prominently
- Include at least one impressive animated hero moment
- Include a fake IDE/security dashboard visual
- Use concise, punchy copy
- Avoid bloated paragraphs
- Avoid generic cyber-security stock design
- Feel more like a developer tool than a traditional cyber-security website

---

## Possible pages for later

Start with one landing page only. Later pages could include:

- Product
- Security model
- Docs
- Pricing
- Blog
- Waitlist
- Changelog
- Comparison with VS Code / Cursor

---

## First Claude Code task

Create the first version of the Bastion landing page.

### Deliverable

A polished single-page React landing page using the Bastion branding direction above.

### Requirements

- Use the Bastion SVG/logo if available in the project files
- Use a dark, premium developer-tool aesthetic
- Build a hero section with animated visual interest
- Include product problem, solution, features, how-it-works, comparison, and CTA sections
- Use ReactBits.dev-inspired effects where sensible
- Keep copy concise and strong
- Make it responsive
- Keep the implementation simple and maintainable

### Suggested implementation steps

1. Inspect the project structure and available assets
2. Set up or confirm Vite, React, TypeScript, and Tailwind
3. Add the Bastion logo asset
4. Create the landing page structure
5. Build the hero section first
6. Add feature cards and fake IDE/security dashboard visual
7. Add animations and visual polish
8. Test mobile responsiveness
9. Run the app locally and fix any layout issues
10. Summarise what was built and what should be improved next

---

## Success criteria for version 1

The first version is successful if someone can land on the page and understand within 10 seconds:

- Bastion is a secure IDE concept
- It is aimed at modern AI-assisted / fast-moving developers
- It protects against supply chain and developer-environment risks
- Security is enforced by default
- The brand feels credible, premium, and worth exploring further
