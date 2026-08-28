'use client';

import { FormEvent, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  adminCardClassName,
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryBtnClassName,
} from './admin-ui';
import { formatLoginApiError } from '@/lib/api/admin-messages';
import AdminPasswordInput from './AdminPasswordInput';

type Mode = 'login' | 'forgot';

interface AdminLoginFormProps {
  notice?: string | null;
}

export default function AdminLoginForm({ notice = null }: AdminLoginFormProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function switchMode(next: Mode) {
    setMode(next);
    setError('');
    setSuccess('');
    setLoading(false);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(formatLoginApiError(data.message));
        setLoading(false);
        return;
      }

      window.location.href = '/admin/listings';
    } catch {
      setError('Unable to reach the server. Is the API running on localhost:5000?');
      setLoading(false);
    }
  }

  async function handleForgot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message || 'Unable to send reset email.');
        setLoading(false);
        return;
      }

      setSuccess(
        data.message ||
          'If that email is registered for admin access, you will receive a password reset link shortly.'
      );
      setLoading(false);
    } catch {
      setError('Unable to reach the server. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className={`${adminCardClassName} max-w-md w-full`}>
      <div className="flex items-start gap-3 mb-8">
        <div
          className="mt-1.5 h-10 w-0.5 flex-shrink-0 rounded-full"
          style={{ backgroundColor: 'var(--color-brand-accent)' }}
          aria-hidden
        />
        <div>
          <h1 className="text-2xl font-light uppercase tracking-[0.12em] text-[var(--color-almost-white)]">
            Admin
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {mode === 'login'
              ? 'Sign in to manage Waterstone listings.'
              : 'Enter your admin email to receive a password reset link.'}
          </p>
        </div>
      </div>

      {notice && mode === 'login' && !error && (
        <p className="mb-5 text-sm text-amber-300/90" role="status">
          {notice}
        </p>
      )}

      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <div>
            <label htmlFor="admin-email" className={adminLabelClassName}>
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={adminInputClassName}
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="admin-password"
                className={cn(adminLabelClassName, 'mb-0')}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="text-sm text-brand-accent hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <AdminPasswordInput
              id="admin-password"
              autoComplete="current-password"
              required
              value={password}
              onChange={setPassword}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`${adminPrimaryBtnClassName} w-full`}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleForgot} className="space-y-5" noValidate>
          <div>
            <label htmlFor="admin-reset-email" className={adminLabelClassName}>
              Email
            </label>
            <input
              id="admin-reset-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={adminInputClassName}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-brand-accent" role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`${adminPrimaryBtnClassName} w-full`}
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>

          <button
            type="button"
            onClick={() => switchMode('login')}
            className="w-full text-sm text-gray-400 hover:text-[var(--color-almost-white)] transition-colors"
          >
            Back to sign in
          </button>
        </form>
      )}
    </div>
  );
}
