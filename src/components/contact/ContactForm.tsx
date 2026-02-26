'use client';

import { useMemo, useState } from 'react';

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const initialState: FormState = {
  name: '',
  email: '',
  company: '',
  message: ''
};

export function ContactForm() {
  const [state, setState] = useState<FormState>(initialState);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>(
    'idle'
  );
  const [toast, setToast] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return Boolean(state.name.trim() && state.email.trim() && state.message.trim());
  }, [state]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setStatus('idle');
    setToast(null);
    setState((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus('sending');
    setToast(null);

    try {
      const res = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      });

      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Failed to send');
      }

      setState(initialState);
      setStatus('success');
      setToast('Sent');
    } catch {
      setStatus('error');
      setToast('Error');
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          value={state.name}
          onChange={(v) => update('name', v)}
          autoComplete="name"
          required
        />
        <Field
          label="Email"
          type="email"
          value={state.email}
          onChange={(v) => update('email', v)}
          autoComplete="email"
          required
        />
      </div>
      <Field
        label="Company"
        value={state.company}
        onChange={(v) => update('company', v)}
        autoComplete="organization"
      />
      <Field
        label="Message"
        textarea
        value={state.message}
        onChange={(v) => update('message', v)}
        autoComplete="off"
        required
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit || status === 'sending'}
          className={
            'inline-flex items-center justify-center border px-5 py-3 text-sm uppercase tracking-[0.2em] transition ' +
            (!canSubmit || status === 'sending'
              ? 'border-white/10 text-white/40 cursor-not-allowed'
              : 'border-white/30 text-white hover:border-white/60')
          }
        >
          {status === 'sending' ? 'Sending…' : 'Send'}
        </button>

        {toast ? (
          <span
            className="text-xs uppercase tracking-[0.2em] text-white/70"
            role="status"
            aria-live="polite"
          >
            {toast}
          </span>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  textarea = false,
  autoComplete,
  required = false
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-[0.2em] text-white/60">{label}</div>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          required={required}
          className="mt-2 w-full resize-none border border-white/15 bg-black/30 px-3 py-3 text-white/90 outline-none transition focus:border-white/40"
          autoComplete={autoComplete}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          required={required}
          className="mt-2 w-full border border-white/15 bg-black/30 px-3 py-3 text-white/90 outline-none transition focus:border-white/40"
          autoComplete={autoComplete}
        />
      )}
    </label>
  );
}
