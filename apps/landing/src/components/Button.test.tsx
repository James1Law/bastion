import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders as an anchor when href is provided', () => {
    render(<Button href="/waitlist">Join the waitlist</Button>);
    const link = screen.getByRole('link', { name: /join the waitlist/i });
    expect(link).toHaveAttribute('href', '/waitlist');
  });

  it('renders as a button when no href is provided', () => {
    render(<Button>Submit</Button>);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('fires onClick when activated', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole('button', { name: /go/i }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('applies the secondary variant classes', () => {
    render(<Button variant="secondary">Learn more</Button>);
    expect(screen.getByRole('button', { name: /learn more/i })).toHaveClass('border');
  });
});
