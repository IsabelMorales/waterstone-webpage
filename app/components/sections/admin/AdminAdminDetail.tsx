'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { AdminUser } from '@/lib/types/admin';
import { cn } from '@/lib/utils';
import ChevronLeft from '../../common/ChevronLeft';
import {
  adminPrimaryBtnClassName,
  adminSecondaryBtnClassName,
} from './admin-ui';

interface AdminAdminDetailProps {
  admin: AdminUser;
  currentUserId: string;
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-700/60 py-4 first:pt-0 last:border-b-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-accent">
        {label}
      </dt>
      <dd className="mt-2 text-base text-[var(--color-almost-white)] leading-relaxed break-all">
        {value || <span className="text-gray-500">—</span>}
      </dd>
    </div>
  );
}

function formatDate(ts: number | null): string {
  if (ts == null) return '—';
  return new Date(ts).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function AdminAdminDetail({
  admin,
  currentUserId,
}: AdminAdminDetailProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isSelf = admin.id === currentUserId;

  async function handleDelete() {
    if (isSelf) {
      setError('You cannot delete your own account.');
      return;
    }
    const label = admin.displayName || admin.email;
    if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) {
      return;
    }
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/admins/${admin.id}`, {
        method: 'DELETE',
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message || 'Delete failed.');
        setBusy(false);
        return;
      }
      window.location.assign('/admin/admins');
    } catch {
      setError('Unable to delete admin.');
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/admin/admins"
        className="inline-flex items-center gap-2 text-base md:text-lg font-medium text-[var(--color-almost-white)] hover:text-brand-accent transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
        Back to admin users
      </Link>

      <div className="mt-5 mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="mt-1.5 h-10 w-0.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: 'var(--color-brand-accent)' }}
            aria-hidden
          />
          <div className="min-w-0">
            <span className="inline-block rounded-full bg-brand-primary/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-accent">
              {admin.role}
            </span>
            <h1 className="mt-3 text-2xl md:text-3xl font-light uppercase tracking-[0.08em] text-[var(--color-almost-white)] leading-snug break-all">
              {admin.displayName || admin.email}
            </h1>
            {admin.displayName && (
              <p className="mt-2 text-sm text-gray-400 break-all">
                {admin.email}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/admins/${admin.id}/edit`}
            className={adminPrimaryBtnClassName}
          >
            Edit admin
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy || isSelf}
            title={isSelf ? 'You cannot delete your own account' : undefined}
            className={cn(
              adminSecondaryBtnClassName,
              'border-red-500/40 text-red-300 hover:border-red-400 hover:text-red-200 disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-6 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="border border-gray-700/80 rounded-lg bg-gray-800/40 px-6 py-6 md:px-8">
        <dl>
          <Field label="Email" value={admin.email} />
          <Field label="Display name" value={admin.displayName} />
          <Field label="Role" value={admin.role} />
        </dl>
      </div>
    </div>
  );
}
