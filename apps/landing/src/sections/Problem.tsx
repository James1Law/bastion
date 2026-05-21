import { motion, useReducedMotion, type Variants } from 'motion/react';
import { GitBranch, Package, Puzzle, type LucideIcon } from 'lucide-react';
import { Container } from '@/components/Container';
import { cn } from '@/lib/cn';

interface Risk {
  Icon: LucideIcon;
  title: string;
  body: string;
}

const risks: readonly Risk[] = [
  {
    Icon: Package,
    title: "A dependency you've never heard of",
    body: 'A transitive package gets pulled in by something you did install. Hours-old, unfamiliar maintainer, no audit. It runs the moment you build.',
  },
  {
    Icon: GitBranch,
    title: 'A workflow with the keys to the kingdom',
    body: 'A GitHub Action with overly broad permissions runs on every pull request. One compromised step is enough to read secrets and rewrite history.',
  },
  {
    Icon: Puzzle,
    title: 'An extension that updated overnight',
    body: 'A VS Code extension you trusted last week pushed a silent update. It now reads your source, your env, and your clipboard — with the permissions you already granted.',
  },
] as const;

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export function Problem(): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? 'visible' : 'hidden';

  return (
    <section
      id="problem"
      className="relative border-t border-bastion-border/60 py-24 sm:py-32"
      aria-labelledby="problem-heading"
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
            id="problem-heading"
            variants={itemVariants}
            className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl"
          >
            <span className="block text-bastion-muted">AI makes developers faster.</span>
            <span className="block text-bastion-fg">It does not make them safer.</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base text-bastion-muted sm:text-lg"
          >
            The same workflows that ship a feature in an afternoon also ship the next supply-chain
            compromise. Most tooling warns you after it’s already in your repo — or expects you to
            wire up the guardrails yourself.
          </motion.p>
        </motion.div>

        <motion.ul
          className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-3 sm:gap-6"
          variants={groupVariants}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {risks.map((risk) => (
            <RiskCard key={risk.title} risk={risk} />
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}

function RiskCard({ risk }: { risk: Risk }): React.JSX.Element {
  const { Icon, title, body } = risk;
  return (
    <motion.li
      variants={itemVariants}
      className={cn(
        'group relative flex flex-col gap-4 rounded-xl border border-bastion-border bg-bastion-surface p-6',
        'transition-colors hover:border-bastion-border-strong',
      )}
    >
      <span
        className="inline-flex size-9 items-center justify-center rounded-md bg-bastion-surface-2 text-bastion-muted ring-1 ring-bastion-border"
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
