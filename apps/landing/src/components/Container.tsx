import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Container({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn('mx-auto w-full max-w-6xl px-6 sm:px-8', className)} {...rest} />;
}
