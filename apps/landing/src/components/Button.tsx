import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
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
  'inline-flex items-center justify-center gap-2 rounded-md font-medium ' +
  'transition focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-bastion-accent disabled:cursor-not-allowed disabled:opacity-60';

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-6 text-sm',
};

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-bastion-accent text-bastion-bg hover:brightness-110 active:brightness-95',
  secondary:
    'border border-bastion-border text-bastion-fg hover:border-bastion-accent/60 hover:text-bastion-fg',
};

export function Button(props: ButtonProps): React.JSX.Element {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...rest
  } = props as CommonProps & Record<string, unknown> & { href?: string };
  const classes = cn(base, sizes[size], variants[variant], className);

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
