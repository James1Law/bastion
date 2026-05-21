import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import logoUrl from '@/assets/bastion-logo.svg';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { SecurityPanelMockup } from '@/components/SecurityPanelMockup';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export function Hero(): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? 'visible' : 'hidden';

  return (
    <section className="relative isolate overflow-hidden pb-20 pt-24 sm:pb-28 sm:pt-32 lg:pb-36">
      <HeroBackdrop />
      <Container>
        <motion.div
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
          variants={containerVariants}
          initial={initial}
          animate="visible"
        >
          <motion.img
            variants={itemVariants}
            src={logoUrl}
            alt="Bastion"
            className="mb-8 h-20 w-auto sm:h-24 lg:h-28"
          />
          <motion.div variants={itemVariants}>
            <StatusPill />
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="mt-6 text-balance text-4xl font-semibold tracking-tight text-bastion-fg sm:text-5xl lg:text-6xl"
          >
            The security-first IDE for AI-assisted development.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-pretty text-base text-bastion-muted sm:text-lg"
          >
            Bastion is a hardened VS Code fork that protects your codebase from supply-chain risk,
            unsafe dependencies, compromised extensions, and insecure workflows — before they reach
            production.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <Button href="#waitlist" variant="primary">
              Join the waitlist
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button href="#how" variant="secondary">
              See how it works
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 sm:mt-20"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: reduceMotion ? 0 : 0.35 }}
        >
          <SecurityPanelMockup className="mx-auto max-w-4xl" />
        </motion.div>
      </Container>
    </section>
  );
}

function StatusPill(): React.JSX.Element {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-bastion-border bg-bastion-surface/60 px-3 py-1 text-xs text-bastion-muted backdrop-blur-sm">
      <span
        className="size-1.5 rounded-full bg-bastion-accent shadow-[0_0_8px_var(--color-bastion-accent)]"
        aria-hidden="true"
      />
      Early access · now in development
    </span>
  );
}

function HeroBackdrop(): React.JSX.Element {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(60% 50% at 50% -10%, color-mix(in oklab, var(--color-bastion-accent) 22%, transparent) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-bastion-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-bastion-border) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, black 30%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 50% 0%, black 0%, black 30%, transparent 75%)',
        }}
      />
    </div>
  );
}
