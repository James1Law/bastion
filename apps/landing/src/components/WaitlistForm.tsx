import { useId, useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { cn } from '@/lib/cn';

interface FormValues {
  name: string;
  email: string;
  role: string;
  building: string;
}

interface Errors {
  name?: string;
  email?: string;
}

const emptyForm: FormValues = { name: '', email: '', role: '', building: '' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): Errors {
  const errors: Errors = {};
  if (values.name.trim().length === 0) {
    errors.name = 'Please enter your name.';
  }
  if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Please enter a valid email.';
  }
  return errors;
}

type Status = 'idle' | 'submitting' | 'submitted' | 'error';

export function WaitlistForm(): React.JSX.Element {
  const nameId = useId();
  const emailId = useId();
  const roleId = useId();
  const buildingId = useId();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]): void {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof Errors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof Errors];
        return next;
      });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const next = validate(values);
    setErrors(next);

    if (Object.keys(next).length > 0) {
      if (next.name) {
        nameRef.current?.focus();
      } else if (next.email) {
        emailRef.current?.focus();
      }
      return;
    }

    setStatus('submitting');
    setFormError(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setSubmittedEmail(values.email);
        setStatus('submitted');
        return;
      }

      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus('error');
      setFormError(data?.error ?? 'Something went wrong. Please try again.');
    } catch {
      setStatus('error');
      setFormError('Network error. Please check your connection and try again.');
    }
  }

  if (status === 'submitted') {
    return <SuccessState email={submittedEmail} />;
  }

  const isSubmitting = status === 'submitting';

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="rounded-2xl border border-bastion-border bg-bastion-surface p-6 sm:p-8"
      aria-labelledby="waitlist-heading"
    >
      {formError ? (
        <div
          role="alert"
          className="mb-5 rounded-md border border-bastion-danger/40 bg-bastion-danger-soft px-3 py-2 text-sm text-bastion-danger"
        >
          {formError}
        </div>
      ) : null}
      <fieldset disabled={isSubmitting} className="flex flex-col gap-5">
        <Field
          id={nameId}
          inputRef={nameRef}
          label="Name"
          required
          autoComplete="name"
          value={values.name}
          onChange={(v) => update('name', v)}
          error={errors.name}
          placeholder="Ada Lovelace"
        />
        <Field
          id={emailId}
          inputRef={emailRef}
          label="Email"
          required
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(v) => update('email', v)}
          error={errors.email}
          placeholder="ada@you.dev"
        />
        <Field
          id={roleId}
          label="Role or company"
          optional
          autoComplete="organization-title"
          value={values.role}
          onChange={(v) => update('role', v)}
          placeholder="Founding engineer at …"
        />
        <Field
          id={buildingId}
          label="What are you building?"
          optional
          value={values.building}
          onChange={(v) => update('building', v)}
          placeholder="A side project, a startup, an internal tool…"
          multiline
        />
      </fieldset>

      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-bastion-subtle">
          No tracking pixels. No selling your address. Unsubscribe anytime.
        </p>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Joining…
            </>
          ) : (
            'Join the waitlist'
          )}
        </Button>
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  optional?: boolean;
  type?: 'text' | 'email';
  autoComplete?: string;
  placeholder?: string;
  error?: string | undefined;
  multiline?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  optional,
  type = 'text',
  autoComplete,
  placeholder,
  error,
  multiline,
  inputRef,
}: FieldProps): React.JSX.Element {
  const errorId = `${id}-error`;
  const baseInput =
    'w-full rounded-md border bg-bastion-surface-2 px-3 py-2 text-sm text-bastion-fg ' +
    'placeholder:text-bastion-subtle ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bastion-accent ' +
    'focus:border-bastion-accent/60';
  const borderClass = error ? 'border-bastion-danger' : 'border-bastion-border';

  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm text-bastion-fg">
        <span>
          {label}
          {required ? <span className="text-bastion-danger"> *</span> : null}
        </span>
        {optional ? (
          <span className="text-[11px] uppercase tracking-widest text-bastion-subtle">
            Optional
          </span>
        ) : null}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          className={cn('mt-1.5 min-h-24 resize-y', baseInput, borderClass)}
        />
      ) : (
        <input
          id={id}
          ref={inputRef}
          type={type}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn('mt-1.5', baseInput, borderClass)}
        />
      )}
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-bastion-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SuccessState({ email }: { email: string }): React.JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col gap-3 rounded-2xl border border-bastion-border bg-bastion-surface p-6 sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span
          className="inline-flex size-9 items-center justify-center rounded-md bg-bastion-accent-soft text-bastion-accent ring-1 ring-bastion-accent/40"
          aria-hidden="true"
        >
          <CheckCircle2 className="size-4" />
        </span>
        <h3 className="text-base font-medium text-bastion-fg">You’re on the list.</h3>
      </div>
      <p className="text-sm text-bastion-muted">
        We’ll send an invite to <span className="text-bastion-fg">{email}</span> when Bastion goes
        live. Until then, expect the occasional note as the security model evolves.
      </p>
    </div>
  );
}
