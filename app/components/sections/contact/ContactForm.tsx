'use client';

import { useState, FormEvent } from 'react';
import { cn } from '@/lib/utils';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormFields {
  name: string;
  email: string;
  phone: string;
  city: string;
  message: string;
}

const initialFields: FormFields = {
  name: '',
  email: '',
  phone: '',
  city: '',
  message: '',
};

const inputClassName = cn(
  'w-full rounded-lg border border-gray-600 bg-gray-900/50 px-4 py-3',
  'text-[var(--color-almost-white)] placeholder:text-gray-500',
  'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
  'transition-colors'
);

export default function ContactForm() {
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function updateField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus('error');
        setErrorMessage(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setFields(initialFields);
    } catch {
      setStatus('error');
      setErrorMessage('Unable to send your message. Please try again later.');
    }
  }

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-800/50 px-6 py-8 md:px-10 md:py-10 transition-colors hover:border-gray-600">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-[var(--color-almost-white)] mb-2">
              Name
            </label>
            <input
              id="contact-name"
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
            <label htmlFor="contact-email" className="block text-sm font-medium text-[var(--color-almost-white)] mb-2">
              Email
            </label>
            <input
              id="contact-email"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contact-phone" className="block text-sm font-medium text-[var(--color-almost-white)] mb-2">
              Phone Number
            </label>
            <input
              id="contact-phone"
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
          <div>
            <label htmlFor="contact-city" className="block text-sm font-medium text-[var(--color-almost-white)] mb-2">
              City
            </label>
            <input
              id="contact-city"
              name="city"
              type="text"
              required
              autoComplete="address-level2"
              value={fields.city}
              onChange={(e) => updateField('city', e.target.value)}
              className={inputClassName}
              placeholder="New York"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-[var(--color-almost-white)] mb-2">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            value={fields.message}
            onChange={(e) => updateField('message', e.target.value)}
            className={cn(inputClassName, 'resize-y min-h-[8rem]')}
            placeholder="How can we help?"
          />
        </div>

        {status === 'success' && (
          <p className="text-sm text-brand-almost-white" role="status">
            Thank you — your message has been sent. We&apos;ll get back to you soon.
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-400" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className={cn(
            'w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-all',
            'bg-brand-primary text-[var(--color-almost-white)]',
            'hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {status === 'loading' ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  );
}
