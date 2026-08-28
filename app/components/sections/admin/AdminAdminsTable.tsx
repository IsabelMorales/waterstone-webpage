'use client';

import Link from 'next/link';
import type { AdminUser } from '@/lib/types/admin';
import { cn } from '@/lib/utils';
import { adminPrimaryBtnClassName } from './admin-ui';

interface AdminAdminsTableProps {
  admins: AdminUser[];
}

function formatDate(ts: number | null): string {
  if (ts == null) return '—';
  return new Date(ts).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function AdminAdminsTable({ admins }: AdminAdminsTableProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
        <div className="flex items-start gap-3">
          <div
            className="mt-1.5 h-10 w-0.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: 'var(--color-brand-accent)' }}
            aria-hidden
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-light uppercase tracking-[0.1em] text-[var(--color-almost-white)]">
              Admin users
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {admins.length} user{admins.length === 1 ? '' : 's'} · tap a card
              to manage
            </p>
          </div>
        </div>
        <Link href="/admin/admins/new" className={adminPrimaryBtnClassName}>
          New admin
        </Link>
      </div>

      {!admins.length ? (
        <div className="border border-dashed border-gray-700 rounded-lg bg-gray-900/30 px-6 py-14 text-center">
          <p className="text-[var(--color-almost-white)] font-medium">
            No admin users yet
          </p>
          <p className="mt-2 text-sm text-gray-400 max-w-md mx-auto">
            Create the first admin account to manage listings and other users.
          </p>
          <Link
            href="/admin/admins/new"
            className={cn(adminPrimaryBtnClassName, 'mt-6')}
          >
            Create admin
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
          {admins.map((admin) => (
            <li key={admin.id}>
              <Link
                href={`/admin/admins/${admin.id}`}
                className="group block border border-gray-700/80 rounded-lg bg-gray-800/40 overflow-hidden transition-colors hover:border-brand-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                <div className="p-5">
                  <span className="inline-block rounded-full bg-brand-primary/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-accent">
                    {admin.role}
                  </span>
                  <h2 className="mt-3 text-lg font-semibold text-[var(--color-almost-white)] leading-snug group-hover:text-brand-accent transition-colors break-all">
                    {admin.displayName || admin.email}
                  </h2>
                  {admin.displayName && (
                    <p className="mt-1 text-sm text-gray-300 break-all">
                      {admin.email}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-gray-500">
                    Updated {formatDate(admin.updatedAt)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
