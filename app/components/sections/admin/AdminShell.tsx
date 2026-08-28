'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AuthUser } from '@/lib/types/listing';

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    async function check() {
      try {
        const response = await fetch('/api/admin/me');
        if (!response.ok) {
          router.replace('/admin');
          return;
        }
        const data = (await response.json()) as { user: AuthUser };
        if (active) {
          setUser(data.user);
          setChecking(false);
        }
      } catch {
        router.replace('/admin');
      }
    }
    void check();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.assign('/admin');
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <p className="text-gray-400 tracking-wide">Checking session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="border-b border-gray-700/80 bg-[var(--color-almost-black)]/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 text-sm">
            <Link
              href="/admin/listings"
              className="font-semibold uppercase tracking-[0.12em] text-[var(--color-almost-white)] hover:text-brand-accent transition-colors"
            >
              Listings
            </Link>
            <Link
              href="/admin/admins"
              className="font-semibold uppercase tracking-[0.12em] text-[var(--color-almost-white)] hover:text-brand-accent transition-colors"
            >
              Users
            </Link>
            <span className="hidden sm:block h-4 w-px bg-gray-700" aria-hidden />
            <Link
              href="/listings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-brand-accent transition-colors"
            >
              Public site
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {user?.email && (
              <span className="hidden sm:inline text-gray-500 truncate max-w-[14rem]">
                {user.email}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="text-gray-300 hover:text-[var(--color-almost-white)] transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
        <div
          className="h-0.5 w-full"
          style={{ backgroundColor: 'var(--color-brand-accent)' }}
          aria-hidden
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {children}
      </div>
    </div>
  );
}
