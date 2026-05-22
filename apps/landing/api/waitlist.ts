/**
 * POST /api/waitlist
 *
 * Vercel edge function. Adds a contact to a Resend audience (called a
 * "segment" in the v6 SDK — same thing in the dashboard), sends a
 * confirmation email, and — if WAITLIST_NOTIFY_EMAIL is set — emails the
 * project owner with the full submission for richer context than the
 * audience itself stores.
 *
 * Required env vars (set in Vercel):
 *   RESEND_API_KEY        — re_… server-side API key
 *   RESEND_AUDIENCE_ID    — audience/segment id (UI: "Audiences" → your list)
 *   WAITLIST_FROM_EMAIL   — sender, must be on a verified Resend domain
 *
 * Optional:
 *   WAITLIST_NOTIFY_EMAIL — where to email rich submission details.
 *                           If unset, the optional role / building
 *                           fields are accepted by the form but never
 *                           stored anywhere.
 */
import { Resend, type CreateContactOptions } from 'resend';

export const config = {
  runtime: 'edge',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Submission {
  name: string;
  email: string;
  role?: string;
  building?: string;
}

function parseSubmission(input: unknown): Submission | { error: string } {
  if (typeof input !== 'object' || input === null) {
    return { error: 'Invalid request body.' };
  }
  const obj = input as Record<string, unknown>;

  const name = obj['name'];
  const email = obj['email'];
  const role = obj['role'];
  const building = obj['building'];

  if (typeof name !== 'string' || name.trim().length === 0) {
    return { error: 'Please enter your name.' };
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return { error: 'Please enter a valid email.' };
  }

  const submission: Submission = {
    name: name.trim().slice(0, 200),
    email: email.trim().toLowerCase().slice(0, 200),
  };
  if (typeof role === 'string' && role.trim().length > 0) {
    submission.role = role.trim().slice(0, 200);
  }
  if (typeof building === 'string' && building.trim().length > 0) {
    submission.building = building.trim().slice(0, 1000);
  }
  return submission;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const parsed = parseSubmission(raw);
  if ('error' in parsed) {
    return json(parsed, 400);
  }

  const apiKey = process.env['RESEND_API_KEY'];
  const audienceId = process.env['RESEND_AUDIENCE_ID'];
  const fromEmail = process.env['WAITLIST_FROM_EMAIL'];
  const notifyEmail = process.env['WAITLIST_NOTIFY_EMAIL'];

  if (!apiKey || !audienceId || !fromEmail) {
    console.error('[waitlist] not configured', {
      hasApiKey: Boolean(apiKey),
      hasAudience: Boolean(audienceId),
      hasFrom: Boolean(fromEmail),
    });
    return json({ error: 'The waitlist is temporarily unavailable. Please try again later.' }, 503);
  }

  const resend = new Resend(apiKey);
  const [firstName = '', ...rest] = parsed.name.split(/\s+/);
  const lastName = rest.join(' ');

  // 1) Add to audience. Treat duplicates as success.
  const contactPayload: CreateContactOptions = {
    email: parsed.email,
    firstName,
    segments: [{ id: audienceId }],
    unsubscribed: false,
  };
  if (lastName) contactPayload.lastName = lastName;

  const contact = await resend.contacts.create(contactPayload);

  if (contact.error) {
    const message = String(contact.error.message ?? '').toLowerCase();
    const isDuplicate = message.includes('already') || message.includes('exists');
    if (!isDuplicate) {
      console.error('[waitlist] resend.contacts.create failed', contact.error);
      return json({ error: 'Could not add you to the list. Please try again.' }, 502);
    }
  }

  // 2) Confirmation email — best-effort. If Resend bounces, we've still got
  //    the contact in the audience, so don't fail the user's submission.
  const confirmRes = await resend.emails.send({
    from: fromEmail,
    to: parsed.email,
    subject: 'You’re on the Bastion waitlist',
    text: confirmationText(firstName || 'there'),
  });
  if (confirmRes.error) {
    console.error('[waitlist] confirmation email failed', confirmRes.error);
  }

  // 3) Admin notification — best-effort; only sent if configured.
  if (notifyEmail) {
    const notifyRes = await resend.emails.send({
      from: fromEmail,
      to: notifyEmail,
      subject: `New Bastion waitlist signup: ${parsed.email}`,
      text: notificationText(parsed),
    });
    if (notifyRes.error) {
      console.error('[waitlist] admin notification failed', notifyRes.error);
    }
  }

  return json({ ok: true }, 200);
}

function confirmationText(firstName: string): string {
  return [
    `Hi ${firstName},`,
    '',
    'Thanks for joining the Bastion waitlist — you’re on the list.',
    '',
    'Bastion is in active development. We’ll send an invite when the IDE is ready to install, plus the occasional note as the security model evolves.',
    '',
    '— Bastion',
  ].join('\n');
}

function notificationText(s: Submission): string {
  const lines = [`Name:    ${s.name}`, `Email:   ${s.email}`];
  if (s.role) lines.push(`Role:    ${s.role}`);
  if (s.building) lines.push(`Project: ${s.building}`);
  return lines.join('\n');
}
