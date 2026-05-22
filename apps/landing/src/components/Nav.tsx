import logoUrl from '@/assets/bastion-logo.svg';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';

interface NavLink {
  href: string;
  label: string;
}

const links: readonly NavLink[] = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#comparison', label: 'Compare' },
] as const;

export function Nav(): React.JSX.Element {
  return (
    <header
      className="sticky top-0 z-50 border-b border-bastion-border/60 bg-bastion-bg/80 backdrop-blur-md"
      aria-label="Primary"
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <a
            href="#top"
            className="flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bastion-accent"
            aria-label="Bastion — back to top"
          >
            <img src={logoUrl} alt="Bastion" className="h-7 w-auto sm:h-8" />
          </a>
          <nav aria-label="Sections" className="hidden gap-7 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded text-sm text-bastion-muted transition-colors hover:text-bastion-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bastion-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <Button href="#waitlist" variant="primary" size="sm">
            Join waitlist
          </Button>
        </div>
      </Container>
    </header>
  );
}
