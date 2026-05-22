import { motion, useReducedMotion, type Variants } from 'motion/react';
import {
  Clock,
  Filter,
  GitCommit,
  KeyRound,
  ScanLine,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/Container';
import { cn } from '@/lib/cn';

interface Feature {
  Icon: LucideIcon;
  title: string;
  body: string;
}

const features: readonly Feature[] = [
  {
    Icon: ShieldCheck,
    title: 'Hardened extension updates',
    body: 'Extensions don’t auto-update behind your back. Every change is reviewed and signed off before it touches your workspace.',
  },
  {
    Icon: Filter,
    title: 'Dependency firewall',
    body: 'npm installs route through a Socket-style security layer. Suspicious packages are blocked before they hit node_modules.',
  },
  {
    Icon: ScanLine,
    title: 'GitHub Actions linting',
    body: 'Zizmor runs against your workflows. Risky permissions, unpinned actions, and known attack patterns are flagged before merge.',
  },
  {
    Icon: GitCommit,
    title: 'Local commit protection',
    body: 'A local security agent runs on every commit and pre-push, so problems are caught before code leaves the machine.',
  },
  {
    Icon: KeyRound,
    title: 'Secrets scanning',
    body: 'Secrets are detected and blocked locally — long before they reach GitHub or anything an attacker can read.',
  },
  {
    Icon: Clock,
    title: 'Minimum package age',
    body: 'New releases need to season. Hours-old packages are blocked unless you explicitly opt in for that one install.',
  },
] as const;

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export function Solution(): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? 'visible' : 'hidden';

  return (
    <section
      id="solution"
      className="relative border-t border-bastion-border/60 py-24 sm:py-32"
      aria-labelledby="solution-heading"
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
            id="solution-heading"
            variants={itemVariants}
            className="text-balance text-3xl font-semibold tracking-tight text-bastion-fg sm:text-5xl"
          >
            Bastion turns security into the default path.
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base text-bastion-muted sm:text-lg"
          >
            Bastion is a familiar IDE — built on the VS Code base you already know — with a hardened
            security layer wired into every action that touches your dependencies, workflows, and
            machine.
          </motion.p>
        </motion.div>

        <motion.ul
          className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          variants={groupVariants}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }): React.JSX.Element {
  const { Icon, title, body } = feature;
  return (
    <motion.li
      variants={itemVariants}
      className={cn(
        'group relative flex flex-col gap-4 rounded-xl border border-bastion-border bg-bastion-surface p-6',
        'transition-colors hover:border-bastion-border-strong',
      )}
    >
      <span
        className="inline-flex size-9 items-center justify-center rounded-md bg-bastion-surface-2 text-bastion-fg ring-1 ring-bastion-accent/25"
        aria-hidden="true"
      >
        <Icon className="size-4" />
      </span>
      <div>
        <h3 className="text-base font-medium text-bastion-fg">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-bastion-muted">{body}</p>
      </div>
    </motion.li>
  );
}
