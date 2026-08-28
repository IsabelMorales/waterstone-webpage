'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import type { AdminUser } from '@/lib/types/admin';
import ChevronLeft from '../../common/ChevronLeft';
import {
  adminCardClassName,
  adminInputClassName,
  adminLabelClassName,
  adminPrimaryBtnClassName,
  adminSecondaryBtnClassName,
} from './admin-ui';

interface AdminFormProps {
  mode: 'create' | 'edit';
  admin?: AdminUser;
}

export default function AdminForm({ mode, admin }: AdminFormProps) {
  const isCreate = mode === 'create';

  const [email, setEmail] = useState(admin?.email ?? '');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(admin?.displayName ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isCreate) {
        const response = await fetch('/api/admin/admins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password,
            displayName: displayName.trim() || undefined,
          }),
        });
        const data = (await response.json()) as {
          message?: string;
          admin?: AdminUser;
        };
        if (!response.ok) {
          setError(data.message || 'Create failed.');
          setLoading(false);
          return;
        }
        window.location.assign(`/admin/admins/${data.admin?.id ?? ''}`);
        return;
      }

      const payload: Record<string, unknown> = {};
      if (displayName.trim() !== (admin?.displayName ?? '')) {
        payload.displayName = displayName.trim();
      }
      if (email.trim() !== admin?.email) {
        payload.email = email.trim();
      }
      if (password) {
        payload.password = password;
      }

      if (Object.keys(payload).length === 0) {
        window.location.assign(`/admin/admins/${admin!.id}`);
        return;
      }

      const response = await fetch(`/api/admin/admins/${admin!.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message || 'Update failed.');
        setLoading(false);
        return;
      }
      window.location.assign(`/admin/admins/${admin!.id}`);
    } catch {
      setError('Unable to reach the server. Please try again.');
      setLoading(false);
    }
  }

  const backHref = isCreate
    ? '/admin/admins'
    : `/admin/admins/${admin!.id}`;

  return (
    <div className="mx-auto w-full max-w-xl">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-base md:text-lg font-medium text-[var(--color-almost-white)] hover:text-brand-accent transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        {isCreate ? 'Back to admin users' : 'Back to admin detail'}
      </Link>

      <div className={`${adminCardClassName} mt-8`}>
        <div className="flex items-start gap-3 mb-8">
          <div
            className="mt-1.5 h-10 w-0.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: 'var(--color-brand-accent)' }}
            aria-hidden
          />
          <div>
            <h1 className="text-2xl font-light uppercase tracking-[0.12em] text-[var(--color-almost-white)]">
              {isCreate ? 'New admin' : 'Edit admin'}
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {isCreate
                ? 'Creates Firebase Auth account and admin profile.'
                : 'Leave password blank to keep the current one.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="admin-user-email" className={adminLabelClassName}>
              Email
            </label>
            <input
              id="admin-user-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={adminInputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="admin-user-display-name"
              className={adminLabelClassName}
            >
              Display name
            </label>
            <input
              id="admin-user-display-name"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={adminInputClassName}
              placeholder="Optional"
            />
          </div>

          <div>
            <label
              htmlFor="admin-user-password"
              className={adminLabelClassName}
            >
              Password
              {!isCreate && (
                <span className="ml-1 font-normal text-gray-500 normal-case tracking-normal">
                  (optional)
                </span>
              )}
            </label>
            <input
              id="admin-user-password"
              type="password"
              autoComplete={isCreate ? 'new-password' : 'off'}
              required={isCreate}
              minLength={isCreate ? 6 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={adminInputClassName}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className={adminPrimaryBtnClassName}
            >
              {loading
                ? isCreate
                  ? 'Creating…'
                  : 'Saving…'
                : isCreate
                  ? 'Create admin'
                  : 'Save changes'}
            </button>
            <Link href={backHref} className={adminSecondaryBtnClassName}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
