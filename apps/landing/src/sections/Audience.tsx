import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Container } from '@/components/Container';

interface Audience {
  who: string;
  body: string;
}

const audiences: readonly Audience[] = [
  {
    who: 'Vibe coders',
    body: 'Ship at the speed of vibe. Bastion catches the things your flow doesn’t.',
  },
  {
    who: 'Startup founders',
    body: 'You shipped a feature today. Bastion made sure it didn’t ship a backdoor.',
  },
  {
    who: 'Junior developers',
    body: 'Safer defaults from day one. Learn the right habits because the IDE enforces them.',
  },
  {
    who: 'Security-conscious teams',
    body: 'One IDE, one policy, every developer. No “did you remember to…” in PR review.',
  },
  {
    who: 'AI-assisted engineering teams',
    body: 'Models generate fast. Bastion verifies before the diff goes out.',
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

export function Audience(): React.JSX.Element {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? 'visible' : 'hidden';

  return (
    <section
      id="audience"
      className="relative border-t border-bastion-border/60 py-24 sm:py-32"
      aria-labelledby="audience-heading"
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
            id="audience-heading"
            variants={itemVariants}
            className="text-balance text-3xl font-semibold tracking-tight text-bastion-fg sm:text-5xl"
          >
            Built for the way you actually ship.
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base text-bastion-muted sm:text-lg"
          >
            Different roles, same problem — code moves faster than the tools that are supposed to
            keep it safe.
          </motion.p>
        </motion.div>

        <motion.ul
          className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          variants={groupVariants}
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {audiences.map((audience) => (
            <AudienceCard key={audience.who} audience={audience} />
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}

function AudienceCard({ audience }: { audience: Audience }): React.JSX.Element {
  return (
    <motion.li
      variants={itemVariants}
      className="group flex flex-col rounded-xl border border-bastion-border bg-bastion-surface p-6 transition-colors hover:border-bastion-border-strong"
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-bastion-subtle">For</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight text-bastion-fg">{audience.who}</h3>
      <p className="mt-3 text-sm leading-relaxed text-bastion-muted">{audience.body}</p>
    </motion.li>
  );
}
