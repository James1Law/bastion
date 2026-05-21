import {
  AlertTriangle,
  CheckCircle2,
  FileCode,
  GitBranch,
  Package,
  Search,
  Shield,
  XCircle,
} from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { cn } from '@/lib/cn';

type Status = 'warn' | 'block' | 'pass';

interface Check {
  status: Status;
  title: string;
  state: string;
  detail: string;
}

const checks: readonly Check[] = [
  {
    status: 'warn',
    title: 'Zizmor',
    state: '2 issues found',
    detail: '.github/workflows/ci.yml — risky permissions, unpinned action',
  },
  {
    status: 'block',
    title: 'Dependency release age',
    state: 'install blocked',
    detail: 'react-router-dom@7.0.0 — published 5 days ago',
  },
  {
    status: 'block',
    title: 'Socket firewall',
    state: 'install blocked',
    detail: 'left-pad@9.9.9 — suspicious maintainer activity',
  },
  {
    status: 'pass',
    title: 'Secrets scan',
    state: 'passed',
    detail: '0 secrets detected in staged files',
  },
  {
    status: 'pass',
    title: 'Pre-push checks',
    state: 'passed',
    detail: 'all gates clear — git push allowed',
  },
] as const;

const statusStyles: Record<
  Status,
  { Icon: typeof AlertTriangle; iconClass: string; pillClass: string }
> = {
  warn: {
    Icon: AlertTriangle,
    iconClass: 'text-bastion-warn',
    pillClass: 'bg-bastion-warn-soft text-bastion-warn',
  },
  block: {
    Icon: XCircle,
    iconClass: 'text-bastion-danger',
    pillClass: 'bg-bastion-danger-soft text-bastion-danger',
  },
  pass: {
    Icon: CheckCircle2,
    iconClass: 'text-bastion-accent',
    pillClass: 'bg-bastion-accent-soft text-bastion-accent',
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export function SecurityPanelMockup({ className }: { className?: string }): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? 'visible' : 'hidden';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-bastion-border bg-bastion-surface shadow-2xl shadow-black/40',
        'before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-2xl',
        'before:bg-[radial-gradient(80%_60%_at_50%_-10%,color-mix(in_oklab,var(--color-bastion-accent)_12%,transparent)_0%,transparent_60%)]',
        className,
      )}
      aria-label="Preview: Bastion security overview"
    >
      <WindowChrome />
      <div className="flex">
        <ActivityRail />
        <Pane>
          <motion.ul
            className="flex flex-col"
            variants={containerVariants}
            initial={initial}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {checks.map((check) => (
              <CheckRow key={check.title} check={check} />
            ))}
          </motion.ul>
        </Pane>
      </div>
    </div>
  );
}

function WindowChrome(): React.JSX.Element {
  return (
    <div className="flex items-center gap-3 border-b border-bastion-border bg-bastion-surface px-4 py-3">
      <div className="flex gap-1.5" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="ml-2 font-mono text-xs text-bastion-subtle">
        bastion <span className="px-1 text-bastion-border-strong">›</span> security{' '}
        <span className="px-1 text-bastion-border-strong">›</span> overview
      </div>
      <div className="ml-auto flex items-center gap-1.5 rounded-md border border-bastion-border px-2 py-1 text-[10px] text-bastion-muted">
        <span className="size-1.5 rounded-full bg-bastion-accent shadow-[0_0_8px_var(--color-bastion-accent)]" />
        Live
      </div>
    </div>
  );
}

function ActivityRail(): React.JSX.Element {
  const items = [FileCode, Search, GitBranch, Package] as const;
  return (
    <nav
      className="flex w-12 flex-col items-center gap-4 border-r border-bastion-border bg-bastion-surface/60 py-4"
      aria-hidden="true"
    >
      {items.map((Icon, i) => (
        <Icon
          key={i}
          className={cn(
            'size-4',
            i === 0 ? 'text-bastion-fg' : 'text-bastion-subtle hover:text-bastion-muted',
          )}
        />
      ))}
    </nav>
  );
}

function Pane({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="min-w-0 flex-1 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-bastion-accent" />
          <h3 className="text-sm font-medium text-bastion-fg">Security overview</h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-bastion-subtle">
          5 checks
        </span>
      </div>
      {children}
    </div>
  );
}

function CheckRow({ check }: { check: Check }): React.JSX.Element {
  const { Icon, iconClass, pillClass } = statusStyles[check.status];
  return (
    <motion.li
      variants={rowVariants}
      className="-mx-2 flex items-start gap-3 rounded-md px-2 py-3 transition-colors first:pt-2 hover:bg-bastion-surface-2"
    >
      <Icon className={cn('mt-0.5 size-4 shrink-0', iconClass)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-bastion-fg">{check.title}</span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
              pillClass,
            )}
          >
            {check.state}
          </span>
        </div>
        <p className="mt-0.5 truncate font-mono text-xs text-bastion-subtle">{check.detail}</p>
      </div>
    </motion.li>
  );
}
