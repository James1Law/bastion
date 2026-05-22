import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WaitlistForm } from './WaitlistForm';

function mockFetch(response: { status?: number; body?: unknown } | Error): void {
  const fn = vi.fn();
  if (response instanceof Error) {
    fn.mockRejectedValue(response);
  } else {
    const init: ResponseInit = { status: response.status ?? 200 };
    fn.mockResolvedValue(new Response(JSON.stringify(response.body ?? { ok: true }), init));
  }
  vi.stubGlobal('fetch', fn);
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  await user.type(screen.getByLabelText(/^name/i), 'Ada Lovelace');
  await user.type(screen.getByLabelText(/^email/i), 'ada@example.com');
}

describe('WaitlistForm', () => {
  beforeEach(() => {
    mockFetch({ status: 200 });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

  it('shows validation errors and does not POST when required fields are empty', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toHaveAttribute('aria-invalid', 'true');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('flags an invalid email format', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.type(screen.getByLabelText(/^name/i), 'Ada');
    await user.type(screen.getByLabelText(/^email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    expect(screen.queryByText(/please enter your name/i)).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('POSTs to /api/waitlist and switches to the success state on a 2xx response', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await fillRequiredFields(user);
    await user.type(screen.getByLabelText(/role or company/i), 'Founding engineer');
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    expect(fetch).toHaveBeenCalledWith(
      '/api/waitlist',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'content-type': 'application/json' }),
      }),
    );
    const mock = fetch as unknown as ReturnType<typeof vi.fn>;
    const init = mock.mock.calls[0]?.[1] as { body?: string } | undefined;
    const body = JSON.parse(init?.body ?? '{}') as Record<string, unknown>;
    expect(body).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'Founding engineer',
    });

    expect(await screen.findByRole('status')).toHaveTextContent(/you’re on the list/i);
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
  });

  it('surfaces the server-provided error on a 4xx response', async () => {
    mockFetch({ status: 400, body: { error: 'Custom server error.' } });
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    expect(await screen.findByText(/custom server error/i)).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows a network-error message when fetch rejects', async () => {
    mockFetch(new Error('offline'));
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /join the waitlist/i }));

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
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
