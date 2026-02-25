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
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(state.name.trim() && state.email.trim() && state.message.trim());
  }, [state]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setSubmitted(false);
    setState((s) => ({ ...s, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          value={state.name}
          onChange={(v) => update('name', v)}
          autoComplete="name"
        />
        <Field
          label="Email"
          type="email"
          value={state.email}
          onChange={(v) => update('email', v)}
          autoComplete="email"
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
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className={
          'inline-flex items-center justify-center border px-5 py-3 text-sm uppercase tracking-[0.2em] transition ' +
          (canSubmit
            ? 'border-white/30 text-white hover:border-white/60'
            : 'border-white/10 text-white/40 cursor-not-allowed')
        }
      >
        Send
      </button>

      {submitted ? (
        <div className="text-xs uppercase tracking-[0.2em] text-white/70">
          Message captured (placeholder). Wire an API route when ready.
        </div>
      ) : null}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  textarea = false,
  autoComplete
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-[0.2em] text-white/60">{label}</div>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className="mt-2 w-full resize-none border border-white/15 bg-black/30 px-3 py-3 text-white/90 outline-none transition focus:border-white/40"
          autoComplete={autoComplete}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          className="mt-2 w-full border border-white/15 bg-black/30 px-3 py-3 text-white/90 outline-none transition focus:border-white/40"
          autoComplete={autoComplete}
        />
      )}
    </label>
  );
}
