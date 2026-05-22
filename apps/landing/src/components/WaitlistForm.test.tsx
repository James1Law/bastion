import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WaitlistForm } from './WaitlistForm';

describe('WaitlistForm', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all required and optional fields plus the submit button', () => {
    render(<WaitlistForm />);
    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role or company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what are you building/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join the waitlist/i })).toBeInTheDocument();
  });

  it('shows validation errors and does not submit when required fields are empty', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toHaveAttribute('aria-invalid', 'true');
    expect(console.log).not.toHaveBeenCalled();
  });

  it('flags an invalid email format', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.type(screen.getByLabelText(/^name/i), 'Ada');
    await user.type(screen.getByLabelText(/^email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    expect(screen.queryByText(/please enter your name/i)).not.toBeInTheDocument();
  });

  it('switches to the success state on valid submission', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.type(screen.getByLabelText(/^name/i), 'Ada Lovelace');
    await user.type(screen.getByLabelText(/^email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/role or company/i), 'Engineer');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/you’re on the list/i);
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    expect(console.log).toHaveBeenCalledWith(
      '[waitlist] submission',
      expect.objectContaining({ name: 'Ada Lovelace', email: 'ada@example.com', role: 'Engineer' }),
    );
  });

  it('clears a field error as soon as the user starts correcting it', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));
    expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^name/i), 'A');
    expect(screen.queryByText(/please enter your name/i)).not.toBeInTheDocument();
  });
});
