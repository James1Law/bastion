import logoUrl from '@/assets/bastion-logo.svg';

export default function App(): React.JSX.Element {
  return (
    <main className="relative min-h-dvh bg-bastion-bg text-bastion-fg">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--color-bastion-accent) 18%, transparent) 0%, transparent 70%)',
        }}
      />
      <section className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-6 text-center">
        <img src={logoUrl} alt="Bastion" className="mb-10 h-12 w-auto" />
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          The security-first IDE for AI-assisted development.
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-base text-bastion-muted sm:text-lg">
          Bastion is a hardened VS Code fork that protects your codebase from supply chain risk,
          unsafe dependencies, compromised extensions, and insecure workflows — before they reach
          production.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="#waitlist"
            className="inline-flex h-11 items-center justify-center rounded-md bg-bastion-accent px-6 font-medium text-bastion-bg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bastion-accent"
          >
            Join the waitlist
          </a>
          <a
            href="#how"
            className="inline-flex h-11 items-center justify-center rounded-md border border-bastion-border px-6 font-medium text-bastion-fg transition hover:border-bastion-accent/60"
          >
            See how it works
          </a>
        </div>
        <p className="mt-12 text-xs uppercase tracking-[0.2em] text-bastion-muted">
          Foundation ready · landing page sections coming next
        </p>
      </section>
    </main>
  );
}
