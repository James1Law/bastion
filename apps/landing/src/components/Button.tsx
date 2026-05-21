import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary';

interface CommonProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined;
  };

type ButtonAsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const base =
  'inline-flex h-11 items-center justify-center gap-2 rounded-md px-6 text-sm font-medium ' +
  'transition focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-bastion-accent';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-bastion-accent text-bastion-bg hover:brightness-110 active:brightness-95',
  secondary:
    'border border-bastion-border text-bastion-fg hover:border-bastion-accent/60 hover:text-bastion-fg',
};

export function Button(props: ButtonProps): React.JSX.Element {
  const {
    variant = 'primary',
    className,
    children,
    ...rest
  } = props as CommonProps & Record<string, unknown> & { href?: string };
  const classes = cn(base, variants[variant], className);

  if (typeof rest.href === 'string') {
    return (
      <a className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
