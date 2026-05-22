import { motion, useReducedMotion, type Variants } from 'motion/react';
import { AlertTriangle, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import { Container } from '@/components/Container';
import { cn } from '@/lib/cn';

type Align = 'left' | 'right';

interface FeatureContent {
  eyebrow: string;
  title: string;
  body: string;
  bullets: readonly string[];
  visual: React.ReactNode;
  align: Align;
}

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export function Features(): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? 'visible' : 'hidden';

  const features: readonly FeatureContent[] = [
    {
      eyebrow: 'GitHub Actions protection',
      title: 'Catch attack paths in your workflows before they merge.',
      body: 'Zizmor inspects every `.github/workflows/*.yml` for the patterns supply-chain attackers actually use — overly broad permissions, unpinned actions, dangerous triggers — and flags them before review.',
      bullets: [
        'Inline annotations inside the IDE',
        'Blocks merge on critical findings',
        'No CI step to wire up',
      ],
      visual: <ZizmorPanel />,
      align: 'left',
    },
    {
      eyebrow: 'Safer dependencies',
      title: 'Risky installs never reach node_modules.',
      body: 'npm and pnpm installs route through a Socket-style firewall plus a minimum-release-age gate. Hours-old packages, suspicious maintainers, and known malware patterns are blocked at install time — not after.',
      bullets: [
        'Minimum release-age enforcement',
        'Per-install override with audit log',
        'Works with workspace + monorepo installs',
      ],
      visual: <DepFirewallPanel />,
      align: 'right',
    },
    {
      eyebrow: 'Extension control',
      title: 'No extension updates behind your back.',
      body: 'Bastion turns off VS Code extension auto-updates by default. Updates queue up for explicit review with a diff of permission changes, so a marketplace compromise can’t silently grant new access overnight.',
      bullets: [
        'Auto-update OFF by default',
        'Permission-diff before each update',
        'Pinned versions per workspace',
      ],
      visual: <ExtensionsPanel />,
      align: 'left',
    },
    {
      eyebrow: 'Local security agent',
      title: 'Checks run before code leaves your machine.',
      body: 'On every commit and pre-push, a local agent runs the full security sweep — secrets, dependency audit, workflow audit — so problems are caught on your laptop, not by GitHub or a downstream consumer.',
      bullets: [
        'Pre-commit and pre-push hooks',
        'Configurable per workspace',
        'Runs offline — no server required',
      ],
      visual: <AgentPanel />,
      align: 'right',
    },
    {
      eyebrow: 'Secrets protection',
      title: 'Secrets caught locally, not by an attacker.',
      body: 'Bastion scans staged files for the credential patterns that actually leak: API keys, cloud tokens, signing certificates, private keys. Risky commits are blocked locally — long before they reach GitHub.',
      bullets: [
        'Pattern + entropy-based detection',
        'Per-file allowlist for false positives',
        'Block at commit, not at scan-time',
      ],
      visual: <SecretsPanel />,
      align: 'left',
    },
  ] as const;

  return (
    <section
      id="features"
      className="relative border-t border-bastion-border/60 py-24 sm:py-32"
      aria-labelledby="features-heading"
    >
      <Container>
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={groupVariants}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.h2
            id="features-heading"
            variants={itemVariants}
            className="text-balance text-3xl font-semibold tracking-tight text-bastion-fg sm:text-5xl"
          >
            Each guardrail, on by default.
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base text-bastion-muted sm:text-lg"
          >
            The protections you’d build yourself if you had a security team — wired into the IDE so
            you don’t have to.
          </motion.p>
        </motion.div>

        <div className="mt-20 flex flex-col gap-20 sm:mt-28 sm:gap-28">
          {features.map((feature) => (
            <FeatureRow key={feature.eyebrow} feature={feature} reduceMotion={!!reduceMotion} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureRow({
  feature,
  reduceMotion,
}: {
  feature: FeatureContent;
  reduceMotion: boolean;
}): React.JSX.Element {
  const { eyebrow, title, body, bullets, visual, align } = feature;
  const initial = reduceMotion ? 'visible' : 'hidden';

  return (
    <motion.div
      className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
      variants={groupVariants}
      initial={initial}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        variants={itemVariants}
        className={cn('order-1', align === 'right' && 'lg:order-2')}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-bastion-accent">{eyebrow}</p>
        <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-bastion-fg sm:text-3xl">
          {title}
        </h3>
        <p className="mt-4 max-w-xl text-pretty text-base text-bastion-muted">{body}</p>
        <ul className="mt-6 flex flex-col gap-2">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-sm leading-relaxed text-bastion-muted"
            >
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-bastion-accent"
                aria-hidden="true"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className={cn('order-2 min-w-0', align === 'right' && 'lg:order-1')}
      >
        {visual}
      </motion.div>
    </motion.div>
  );
}

/* ---------- Code-style visual panels ---------- */

function CodePanel({
  label,
  children,
  footer,
}: {
  label: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="overflow-hidden rounded-xl border border-bastion-border bg-bastion-surface shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-bastion-border px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-bastion-subtle">
        <span>{label}</span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-1.5 rounded-full bg-bastion-accent shadow-[0_0_8px_var(--color-bastion-accent)]"
            aria-hidden="true"
          />
          Live
        </span>
      </div>
      <div className="px-5 py-5 font-mono text-[13px] leading-relaxed text-bastion-fg">
        {children}
      </div>
      {footer ? (
        <div className="border-t border-bastion-border px-5 py-3 font-mono text-xs text-bastion-subtle">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

function ZizmorPanel(): React.JSX.Element {
  return (
    <CodePanel
      label=".github/workflows/release.yml"
      footer={<span className="text-bastion-danger">2 issues — merge blocked until resolved</span>}
    >
      <pre className="whitespace-pre-wrap break-words text-bastion-muted">
        <span>{'on:\n'}</span>
        <span>{'  pull_request_target:\n'}</span>
        <span className="text-bastion-fg">{'permissions: write-all'}</span>{' '}
        <Annotation kind="block" message="overly broad — write-all" />
        <span>{'\nsteps:\n'}</span>
        <span>{'  - uses: '}</span>
        <span className="text-bastion-fg">{'actions/checkout@main'}</span>{' '}
        <Annotation kind="warn" message="unpinned ref" />
      </pre>
    </CodePanel>
  );
}

function DepFirewallPanel(): React.JSX.Element {
  return (
    <CodePanel
      label="$ pnpm add react-router-dom-x"
      footer={
        <span>
          run with <span className="text-bastion-fg">--override</span> to bypass (logged for audit)
        </span>
      }
    >
      <div className="flex flex-col gap-3">
        <Row status="block" label="react-router-dom-x@1.0.0" detail="install blocked" />
        <ul className="ml-7 flex flex-col gap-1 text-[12px] text-bastion-subtle">
          <li>· published 6 hours ago (minimum: 7 days)</li>
          <li>· maintainer has 0 prior packages</li>
          <li>· socket: similarity 0.91 to react-router-dom</li>
        </ul>
      </div>
    </CodePanel>
  );
}

function ExtensionsPanel(): React.JSX.Element {
  return (
    <CodePanel
      label="extensions ▸ pending review"
      footer={
        <span>
          auto-update: <span className="text-bastion-fg">OFF</span> · pinned per workspace
        </span>
      }
    >
      <ul className="flex flex-col gap-2.5">
        <ExtensionRow
          name="ESLint"
          from="3.1.0"
          to="3.2.0"
          permissions="no permission changes"
          kind="pass"
        />
        <ExtensionRow
          name="Prettier"
          from="9.4.1"
          to="9.5.0"
          permissions="no permission changes"
          kind="pass"
        />
        <ExtensionRow
          name="Pylance"
          from="2024.8"
          to="2024.9"
          permissions="+ reads workspace settings"
          kind="warn"
        />
      </ul>
    </CodePanel>
  );
}

function AgentPanel(): React.JSX.Element {
  return (
    <CodePanel
      label='$ git commit -m "fix: button state"'
      footer={
        <span>
          1 warning — proceed? <span className="text-bastion-fg">[y/N]</span>
        </span>
      }
    >
      <div className="flex flex-col gap-2.5">
        <Row status="pass" label="secrets scan" detail="0 detected" />
        <Row status="pass" label="dependency audit" detail="0 blocked" />
        <Row status="warn" label="workflow audit" detail=".github/workflows/ci.yml" />
        <Row status="pass" label="pre-push checks" detail="ready" />
      </div>
    </CodePanel>
  );
}

function SecretsPanel(): React.JSX.Element {
  return (
    <CodePanel
      label="$ git commit"
      footer={
        <span>
          run <span className="text-bastion-fg">bastion secrets --review</span> to address
        </span>
      }
    >
      <div className="flex flex-col gap-2.5">
        <Row status="block" label="src/config.ts:12" detail="looks like a Stripe key" />
        <Row status="block" label="src/aws-client.ts:47" detail="looks like AWS credentials" />
        <Row status="pass" label="src/components/Button.tsx" detail="clean" />
      </div>
    </CodePanel>
  );
}

/* ---------- Small shared row + annotation primitives ---------- */

type Status = 'pass' | 'warn' | 'block';

function Row({
  status,
  label,
  detail,
}: {
  status: Status;
  label: string;
  detail: string;
}): React.JSX.Element {
  const { Icon, iconClass } = statusIcon(status);
  return (
    <div className="flex items-center gap-3">
      <Icon className={cn('size-4 shrink-0', iconClass)} aria-hidden="true" />
      <span className="text-bastion-fg">{label}</span>
      <span className="ml-auto text-bastion-subtle">{detail}</span>
    </div>
  );
}

function Annotation({
  kind,
  message,
}: {
  kind: 'warn' | 'block';
  message: string;
}): React.JSX.Element {
  const colour = kind === 'warn' ? 'text-bastion-warn' : 'text-bastion-danger';
  return (
    <span className={cn('font-sans text-[11px]', colour)}>
      <ChevronRight className="-mb-px inline size-3" aria-hidden="true" /> {message}
    </span>
  );
}

function ExtensionRow({
  name,
  from,
  to,
  permissions,
  kind,
}: {
  name: string;
  from: string;
  to: string;
  permissions: string;
  kind: 'pass' | 'warn';
}): React.JSX.Element {
  const permClass = kind === 'warn' ? 'text-bastion-warn' : 'text-bastion-subtle';
  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-bastion-fg">{name}</span>
        <span className="text-bastion-subtle">
          v{from} → v{to}
        </span>
      </div>
      <span className={cn('text-[11px]', permClass)}>{permissions}</span>
    </li>
  );
}

function statusIcon(status: Status): {
  Icon: typeof CheckCircle2;
  iconClass: string;
} {
  switch (status) {
    case 'pass':
      return { Icon: CheckCircle2, iconClass: 'text-bastion-accent' };
    case 'warn':
      return { Icon: AlertTriangle, iconClass: 'text-bastion-warn' };
    case 'block':
      return { Icon: XCircle, iconClass: 'text-bastion-danger' };
  }
}
