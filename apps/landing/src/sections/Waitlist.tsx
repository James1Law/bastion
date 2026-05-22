import { motion, useReducedMotion, type Variants } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/Container';
import { WaitlistForm } from '@/components/WaitlistForm';

const bullets: readonly string[] = [
  'Early access when Bastion goes live',
  'Updates as the security model evolves',
  'Influence on which guardrails ship first',
] as const;

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export function Waitlist(): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? 'visible' : 'hidden';

  return (
    <section
      id="waitlist"
      className="relative isolate overflow-hidden border-t border-bastion-border/60 py-24 sm:py-32"
      aria-labelledby="waitlist-heading"
    >
      <Backdrop />
      <Container>
        <motion.div
          className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16"
          variants={groupVariants}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={itemVariants}>
            <h2
              id="waitlist-heading"
              className="text-balance text-3xl font-semibold tracking-tight text-bastion-fg sm:text-5xl"
            >
              Build fast without leaving the gates open.
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-base text-bastion-muted sm:text-lg">
              Bastion is in active development. Join the waitlist for an invite when it goes live —
              and a heads-up as the security model evolves.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-sm leading-relaxed text-bastion-muted"
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

          <motion.div variants={itemVariants}>
            <WaitlistForm />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function Backdrop(): React.JSX.Element {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(60% 60% at 50% 100%, color-mix(in oklab, var(--color-bastion-accent) 18%, transparent) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
