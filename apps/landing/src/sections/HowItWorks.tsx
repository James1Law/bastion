import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Container } from '@/components/Container';

interface Step {
  n: string;
  title: string;
  body: string;
}

const steps: readonly Step[] = [
  {
    n: '01',
    title: 'You write code in Bastion',
    body: 'The same VS Code experience you already know. Nothing changes about how you build.',
  },
  {
    n: '02',
    title: 'Bastion watches the perimeter',
    body: 'Dependencies, extensions, workflows, and secrets are monitored as you work — locally, in real time.',
  },
  {
    n: '03',
    title: 'Risky actions get caught locally',
    body: 'Blocked or flagged before they touch your repo. Every block has an audited override for the cases you really mean.',
  },
  {
    n: '04',
    title: 'Pre-commit and pre-push gates',
    body: 'Team policy runs automatically before code leaves the machine. No checks to remember, no CI step to wire up.',
  },
  {
    n: '05',
    title: 'Safer code reaches GitHub',
    body: 'What ships is what passed every gate. No drift between local and remote, no surprises in review.',
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

export function HowItWorks(): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? 'visible' : 'hidden';

  return (
    <section
      id="how"
      className="relative border-t border-bastion-border/60 py-24 sm:py-32"
      aria-labelledby="how-heading"
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
            id="how-heading"
            variants={itemVariants}
            className="text-balance text-3xl font-semibold tracking-tight text-bastion-fg sm:text-5xl"
          >
            From keystroke to GitHub, every step is checked.
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base text-bastion-muted sm:text-lg"
          >
            Bastion sits inside the development loop — not bolted on after it.
          </motion.p>
        </motion.div>

        <motion.ol
          className="relative mt-16 grid gap-12 sm:mt-20 lg:grid-cols-5 lg:gap-8"
          variants={groupVariants}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* The "rail" threading the steps — desktop only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[18px] right-[18px] top-[18px] hidden h-px bg-bastion-border lg:block"
          />
          {steps.map((step) => (
            <StepBlock key={step.n} step={step} />
          ))}
        </motion.ol>
      </Container>
    </section>
  );
}

function StepBlock({ step }: { step: Step }): React.JSX.Element {
  return (
    <motion.li variants={itemVariants} className="relative flex flex-col">
      <span
        className="relative z-10 inline-flex size-9 items-center justify-center rounded-md bg-bastion-surface font-mono text-sm text-bastion-fg ring-1 ring-bastion-accent/25"
        aria-hidden="true"
      >
        {step.n}
      </span>
      <h3 className="mt-5 text-base font-medium text-bastion-fg">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-bastion-muted">{step.body}</p>
    </motion.li>
  );
}
