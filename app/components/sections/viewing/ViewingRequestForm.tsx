'use client';

import { FormEvent, useMemo, useState, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import ViewingTimeSelect from './ViewingTimeSelect';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface ViewingFormFields {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

interface ViewingRequestFormProps {
  listingTitle: string;
  listingAddress?: string;
  listingSlug?: string;
}

const inputClassName = cn(
  'w-full rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3',
  'text-[var(--color-almost-white)] placeholder:text-gray-500',
  'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
  'transition-colors'
);

function todayIsoLocal(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}

function openNativePicker(event: MouseEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  if (typeof input.showPicker === 'function') {
    try {
      input.showPicker();
    } catch {
      // Browser may reject showPicker in edge cases
    }
  }
}

export default function ViewingRequestForm({
  listingTitle,
  listingAddress = '',
  listingSlug = '',
}: ViewingRequestFormProps) {
  const minDate = useMemo(() => todayIsoLocal(), []);
  const [fields, setFields] = useState<ViewingFormFields>({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function updateField<K extends keyof ViewingFormFields>(
    key: K,
    value: ViewingFormFields[K]
  ) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    if (!fields.preferredTime) {
      setStatus('error');
      setErrorMessage('Please choose a preferred time.');
      return;
    }

    try {
      const response = await fetch('/api/viewing-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          listingTitle,
          listingAddress,
          listingSlug,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus('error');
        setErrorMessage(
          data.error ?? 'Something went wrong. Please try again.'
        );
        return;
      }

      setStatus('success');
      setFields({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        notes: '',
      });
    } catch {
      setStatus('error');
      setErrorMessage('Unable to send your request. Please try again later.');
    }
  }

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-800/50 px-6 py-8 md:px-10 md:py-10 transition-colors hover:border-gray-600">
      {(listingTitle || listingAddress) && (
        <div className="mb-8 rounded-lg border border-gray-700/80 bg-gray-900/40 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-accent">
            Property
          </p>
          {listingTitle ? (
            <p className="mt-2 text-base font-medium text-[var(--color-almost-white)]">
              {listingTitle}
            </p>
          ) : null}
          {listingAddress ? (
            <p className="mt-1 text-sm text-gray-400">{listingAddress}</p>
          ) : null}
        </div>
      )}

      <p className="mb-6 text-sm text-gray-400 leading-relaxed">
        Choose a preferred date and time. This is a request — our team will
        confirm the appointment with you shortly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="viewing-name"
              className="block text-sm font-medium text-[var(--color-almost-white)] mb-2"
            >
              Name
            </label>
            <input
              id="viewing-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              value={fields.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={inputClassName}
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              htmlFor="viewing-email"
              className="block text-sm font-medium text-[var(--color-almost-white)] mb-2"
            >
              Email
            </label>
            <input
              id="viewing-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={fields.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={inputClassName}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="viewing-phone"
            className="block text-sm font-medium text-[var(--color-almost-white)] mb-2"
          >
            Phone Number
          </label>
          <input
            id="viewing-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            value={fields.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className={inputClassName}
            placeholder="(555) 000-0000"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="viewing-date"
              className="block text-sm font-medium text-[var(--color-almost-white)] mb-2"
            >
              Preferred date
            </label>
            <input
              id="viewing-date"
              name="preferredDate"
              type="date"
              required
              min={minDate}
              value={fields.preferredDate}
              onChange={(e) => updateField('preferredDate', e.target.value)}
              onKeyDown={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onClick={openNativePicker}
              className={cn(
                inputClassName,
                '[color-scheme:dark] cursor-pointer caret-transparent'
              )}
            />
          </div>
          <div>
            <label
              htmlFor="viewing-time"
              className="block text-sm font-medium text-[var(--color-almost-white)] mb-2"
            >
              Preferred time
            </label>
            <ViewingTimeSelect
              id="viewing-time"
              value={fields.preferredTime}
              onChange={(value) => updateField('preferredTime', value)}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="viewing-notes"
            className="block text-sm font-medium text-[var(--color-almost-white)] mb-2"
          >
            Notes{' '}
            <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <textarea
            id="viewing-notes"
            name="notes"
            rows={4}
            value={fields.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            className={cn(inputClassName, 'resize-y min-h-[6rem]')}
            placeholder="Anything we should know before the visit?"
          />
        </div>

        {status === 'success' && (
          <p className="text-sm text-[var(--color-almost-white)]" role="status">
            Thank you — your viewing request has been sent. We&apos;ll confirm
            your appointment shortly.
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-400" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !listingTitle}
          className={cn(
            'w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-all',
            'bg-brand-primary text-[var(--color-almost-white)]',
            'hover:bg-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {status === 'loading' ? 'Sending…' : 'Request viewing'}
        </button>

        {!listingTitle && (
          <p className="text-sm text-amber-300/90" role="status">
            Open this form from a listing page so we know which property you
            want to see.
          </p>
        )}
      </form>
    </div>
  );
}
