import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Container } from '@/components/Container';
import { cn } from '@/lib/cn';

interface Row {
  vscode: string;
  bastion: string;
}

const rows: readonly Row[] = [
  {
    vscode: 'Security depends on user setup',
    bastion: 'Security enabled by default',
  },
  {
    vscode: 'Extensions auto-update silently',
    bastion: 'Extension updates queued for review',
  },
  {
    vscode: 'Dependencies install freely',
    bastion: 'Risky installs blocked at install-time',
  },
  {
    vscode: 'Secrets caught after they leak',
    bastion: 'Secrets blocked locally, before commit',
  },
  {
    vscode: 'GitHub Actions risks often missed',
    bastion: 'Workflows linted by Zizmor before merge',
  },
  {
    vscode: 'Designed for flexibility',
    bastion: 'Designed for safe speed',
  },
] as const;

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function Comparison(): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? 'visible' : 'hidden';

  return (
    <section
      id="comparison"
      className="relative border-t border-bastion-border/60 py-24 sm:py-32"
      aria-labelledby="comparison-heading"
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
            id="comparison-heading"
            variants={itemVariants}
            className="text-balance text-3xl font-semibold tracking-tight text-bastion-fg sm:text-5xl"
          >
            What changes when you switch from VS Code?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base text-bastion-muted sm:text-lg"
          >
            The day-to-day stays the same. Everything that touches your codebase from the outside
            doesn’t.
          </motion.p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-xl border border-bastion-border bg-bastion-surface sm:mt-20"
          variants={groupVariants}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <table className="w-full border-collapse">
            <caption className="sr-only">Standard VS Code compared with Bastion</caption>
            <thead>
              <tr className="border-b border-bastion-border">
                <ColumnHeader
                  label="Standard VS Code"
                  className="text-bastion-muted"
                  dotClass="bg-bastion-subtle"
                />
                <ColumnHeader
                  label="Bastion"
                  className="text-bastion-fg"
                  dotClass="bg-bastion-accent shadow-[0_0_8px_var(--color-bastion-accent)]"
                  emphasised
                />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <ComparisonRow key={row.bastion} row={row} isLast={i === rows.length - 1} />
              ))}
            </tbody>
          </table>
        </motion.div>
      </Container>
    </section>
  );
}

function ColumnHeader({
  label,
  className,
  dotClass,
  emphasised = false,
}: {
  label: string;
  className: string;
  dotClass: string;
  emphasised?: boolean;
}): React.JSX.Element {
  return (
    <th
      scope="col"
      className={cn(
        'w-1/2 px-5 py-4 text-left text-xs font-medium uppercase tracking-widest sm:px-6 sm:py-5',
        className,
        emphasised && 'bg-bastion-surface-2',
      )}
    >
      <span className="inline-flex items-center gap-2">
        <span className={cn('size-1.5 rounded-full', dotClass)} aria-hidden="true" />
        {label}
      </span>
    </th>
  );
}

function ComparisonRow({ row, isLast }: { row: Row; isLast: boolean }): React.JSX.Element {
  return (
    <motion.tr variants={itemVariants} className={cn(!isLast && 'border-b border-bastion-border')}>
      <Cell text={row.vscode} dotClass="bg-bastion-subtle" textClass="text-bastion-muted" />
      <Cell
        text={row.bastion}
        dotClass="bg-bastion-accent"
        textClass="text-bastion-fg"
        emphasised
      />
    </motion.tr>
  );
}

function Cell({
  text,
  dotClass,
  textClass,
  emphasised = false,
}: {
  text: string;
  dotClass: string;
  textClass: string;
  emphasised?: boolean;
}): React.JSX.Element {
  return (
    <td
      className={cn(
        'px-5 py-4 text-sm leading-relaxed sm:px-6 sm:py-5',
        textClass,
        emphasised && 'bg-bastion-surface-2',
      )}
    >
      <span className="flex items-start gap-3">
        <span
          className={cn('mt-1.5 size-1.5 shrink-0 rounded-full', dotClass)}
          aria-hidden="true"
        />
        <span>{text}</span>
      </span>
    </td>
  );
}
